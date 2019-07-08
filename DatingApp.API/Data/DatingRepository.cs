using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatingApp.API.Helpers;
using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            this._context = context;
        }

        public DataContext Context { get; }

        public DatingRepository Add<T>(T entity) where T : class
        {
            _context.Add(entity);
            return this;
        }

        public DatingRepository Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
            return this;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(u => u.Photos).FirstOrDefaultAsync(u => u.Id == id);

            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
            var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

            var users = _context.Users
                .Include(u => u.Photos)
                .Where(u => u.Id != userParams.UserId)
                .Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob)
                .AsQueryable()
            ;

            if (userParams.Gender != "both") {
                users = users.Where(u => u.Gender == userParams.Gender).AsQueryable();
            }


            switch (userParams.OrderBy) {
                case "created":
                    users = users.OrderByDescending(u => u.Created).AsQueryable();
                    break;
                default:
                    users = users.OrderByDescending(u => u.LastActive).AsQueryable();
                    break;
            }


            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);

            return photo;
        }

        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(u => u.UserId == userId).FirstOrDefaultAsync(p => p.IsMain);
        }
    }
}