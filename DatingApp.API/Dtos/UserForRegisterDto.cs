using System;
using System.ComponentModel.DataAnnotations;
using DatingApp.API.Models;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto: User
    {
        [Required]
        new public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Password length must be between 4 and 8 characters")]
        public string Password { get; set; }

        [Required]
        new public string Gender { get; set; }

        [Required]
        new public DateTime DateOfBirth { get; set; }

        [Required]
        new public string KnownAs { get; set; }

        [Required]
        new public string City { get; set; }

        [Required]
        new public string Country { get; set; }

        new public DateTime Created { get; set; }
        new public DateTime LastActive { get; set; }
        public UserForRegisterDto()
        {
            Created = DateTime.Now;
            LastActive = DateTime.Now;
        }
    }
}