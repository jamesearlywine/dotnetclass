using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController: ControllerBase
    {
        private readonly Cloudinary _cloudinary;
        private IDatingRepository _repo { get; }
        private IMapper _mapper { get; }
        private IOptions<CloudinarySettings> _cloudinaryConfig { get; }

        public PhotosController(IDatingRepository repo, IMapper mapper, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _repo = repo;
            _mapper = mapper;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.ApiKey,
                _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [HttpGet("{id}", Name = "GetPhoto")]
        public async Task<IActionResult> GetPhoto(int id)
        {
            var photoFromRepo = await _repo.GetPhoto(id);

            if (photoFromRepo != null)
            {
                var photo = _mapper.Map<PhotoForReturnDto>(photoFromRepo);
                return Ok(photo);
            }

            return NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, [FromForm]PhotoForCreationDto photoForCreationDto)
        {
            // [Authorize] already verifies they are logged in .. make sure they are adding a photo to their own user record
            if ( userId != int.Parse( User.FindFirst(ClaimTypes.NameIdentifier).Value ) ) {
                // bail if they are attempting a change to any userid except their own
                return Unauthorized();
            }

            // get the user record for updating
            var userFromRepo = await _repo.GetUser(userId);

            // get the File value/stream from the request
            var file = photoForCreationDto.File;

            // I don't know what this does or why. (initialize with empty object to ensure it's API is available when no file is uploaded?)
            var uploadResult = new ImageUploadResult();

            // if a file was uploaded
            if (file.Length > 0) {
                // read the file
                using (var stream = file.OpenReadStream())
                {
                    // initialize uploadParams
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation().Width(500).Height(500).Crop("fill").Gravity("face")
                    };

                    // do the upload
                    uploadResult = _cloudinary.Upload(uploadParams);

                }
            }

            // get the information from cloudinary image upload results and assign to photoForCreationDto
            photoForCreationDto.Url = uploadResult.Uri.ToString();
            photoForCreationDto.PublicId = uploadResult.PublicId;

            // map from PhotoForCreationDto to Photo
            var photo = _mapper.Map<Photo>(photoForCreationDto);

            // if the user doesn't have a main picture, make this one the main picture
            if ( !userFromRepo.Photos.Any(u => u.IsMain) )
                photo.IsMain = true;

            // save the photo to the user's photos
            userFromRepo.Photos.Add(photo);

            // return success or error reponse
            if ( await _repo.SaveAll() ) {
                var photoToReturn = _mapper.Map<PhotoForReturnDto>(photo);
                return CreatedAtRoute("GetPhoto", new {id = photo.Id}, photoToReturn);
            }

            return BadRequest("Could not add the photo.");
        }

        [HttpPost("{id}/setMain")]
        public async Task<IActionResult> SetMainPhoto(int userId, int id)
        {
            // [Authorize] already verifies they are logged in .. make sure they are updating for a user that == themself (as indicated by their auth token)
            if ( userId != int.Parse( User.FindFirst(ClaimTypes.NameIdentifier).Value ) ) {
                // bail if they are attempting a change to any userid except their own
                return Unauthorized();
            }

            // get the user record for updating
            var userFromRepo = await _repo.GetUser(userId);

            // if the photo being updated, doesn't belong to the userId indicated in the path
            if (!userFromRepo.Photos.Any(p => p.Id == id))
            {
                // return unauthorized
                return Unauthorized();
            }

            // otherwise, load the photo
            var photoFromRepo = await _repo.GetPhoto(id);

            // if it's already their photo, return NoContent
            if (photoFromRepo.IsMain)
                return NoContent();

            // otherwise, let's unset the existing photo, so IsMain = false on that one
            var currentMainPhoton = await _repo.GetMainPhotoForUser(userId);
            currentMainPhoton.IsMain = false;
            // and update the selected photo to IsMain = true
            photoFromRepo.IsMain = true;

            // commit to the database, if it fails return an error
            try {
                await _repo.SaveAll();
            } catch(Exception e) {
                throw new Exception($"Updating photo {id} to be the main photo - failed on save, Exception: {e}");
            }

            return NoContent();

        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int userId, int id)
        {
            // [Authorize] already verifies they are logged in .. make sure they are updating for a user that == themself (as indicated by their auth token)
            if ( userId != int.Parse( User.FindFirst(ClaimTypes.NameIdentifier).Value ) ) {
                // bail if they are attempting a change to any userid except their own
                return Unauthorized();
            }

            // get the user record for updating
            var userFromRepo = await _repo.GetUser(userId);

            // if the photo being updated, doesn't belong to the userId indicated in the path
            if (!userFromRepo.Photos.Any(p => p.Id == id))
            {
                // return unauthorized
                return Unauthorized();
            }

            // otherwise, load the photo
            var photoFromRepo = await _repo.GetPhoto(id);


            // if it's already their photo, return NoContent
            if (photoFromRepo.IsMain)
                return BadRequest("You cannot delete your main photo");

            if (photoFromRepo.PublicId != null) {
                // initialize deleteParams
                var deletionParams = new DeletionParams(photoFromRepo.PublicId);
                // delete from cloudinary
                var deleteResult = _cloudinary.Destroy(deletionParams);

                // if cloudinary delete succeeded, create/queue the delete query for the database
                if (deleteResult.Result == "ok") {
                    _repo.Delete(photoFromRepo);
                } else { // otherwise, return BadRequest
                    return BadRequest("Failed to delete the photo.");
                }
            } else { // if it didn't have a PublicId, go ahead and create/queue the delete query
                _repo.Delete(photoFromRepo);
            }


            // commit to database .. if it fails, return error (though it's now gone from cloudinary)
            try {
                await _repo.SaveAll();
            } catch {
                return BadRequest("Failed to delete the photo.");
            }

            return Ok();
        }

    }
}