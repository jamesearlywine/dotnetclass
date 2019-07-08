using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DatingApp.API.Models;
using DatingApp.API.Dtos;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using DatingApp.API.Helpers;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [ServiceFilter(typeof(UpdateUserLastActive))]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(
            IDatingRepository repo,
            IMapper mapper
        )
        {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers([FromQuery]UserParams userParams)
        {
            var currentUserId = int.Parse( User.FindFirst(ClaimTypes.NameIdentifier).Value );
            var userFromRepo = await _repo.GetUser(currentUserId);

            userParams.UserId = currentUserId;
            userParams.Gender = string.IsNullOrEmpty(userParams.Gender)
                ? userFromRepo.Gender == "male"
                    ? "female"
                    : "male"
                : userParams.Gender
            ;


            var users = await _repo.GetUsers(userParams);
            var mappedUsers = _mapper.Map<IEnumerable<UserForListDto>>(users);

            Response.AddPagination(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages);

            return Ok(mappedUsers);
        }

        [HttpGet("{id}", Name="GetUser")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var mappedUser = _mapper.Map<UserForDetailedDto>(user);

            return Ok(mappedUser);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, UserForUpdateDto userForUpdateDto)
        {
            if ( id != int.Parse( User.FindFirst(ClaimTypes.NameIdentifier).Value ) ) {
                return Unauthorized();
            }

            var userFromRepo = await _repo.GetUser(id);

            _mapper.Map(userForUpdateDto, userFromRepo);

            try {
                await _repo.SaveAll();
            } catch(Exception e) {
                throw new Exception($"Updating user {id} failed on save, Exception: {e}");
            }

            return NoContent();
        }
    }
}
