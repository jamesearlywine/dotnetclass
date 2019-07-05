using System;
using System.Collections.Generic;
using DatingApp.API.Dtos;
using DatingApp.API.Models;
using Newtonsoft.Json;

namespace DatingApp.API.Data
{
    public class Seed
    {
        private readonly DataContext _context;
        public Seed(DataContext context) {
            this._context = context;
        }

        public void SeedUsers()
        {
            var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
            var users = JsonConvert.DeserializeObject<List<UserForRegisterDto>>(userData);
            foreach (var user in users)
            {

                byte[] passwordHash, passwordSalt;
                AuthRepository.CreatePasswordHash(user.Password, out passwordHash, out passwordSalt);

                var newUser = new User {
                    Username = user.Username.ToLower(),
                    PasswordHash = passwordHash,
                    PasswordSalt = passwordSalt,
                    DateOfBirth = user.DateOfBirth,
                    Gender = user.Gender,
                    Interests = user.Interests,
                    KnownAs = user.KnownAs,
                    Created = user.Created,
                    LastActive = user.LastActive,
                    Introduction = user.Introduction,
                    LookingFor = user.LookingFor,
                    City = user.City,
                    Country = user.Country,
                    Photos = user.Photos
                };

                Console.WriteLine("Seeding User: {0}", newUser.Username);
                this._context.Users.Add(newUser);
                this._context.SaveChanges();
            }
        }
    }
}