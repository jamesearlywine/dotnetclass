using System;
using System.ComponentModel.DataAnnotations;
using DatingApp.API.Models;

namespace DatingApp.API.Dtos
{
    public class UserForRegisterDto: User
    {
        [Required]
        [EmailAddress]
        new public string Username { get; set; }

        [Required]
        [StringLength(8, MinimumLength = 4, ErrorMessage = "Password length must be between 4 and 8 characters")]
        public string Password { get; set; }
        new public string Gender { get; set; }
        new public DateTime DateOfBirth { get; set; }
        new public string KnownAs { get; set; }
        new public DateTime Created { get; set; }
        new public DateTime LastActive { get; set; }
        new public string Introduction { get; set; }
        new public string LookingFor { get; set; }
        new public string Interests { get; set; }
        new public string City { get; set; }
        new public string Country { get; set; }
    }
}