using System.Collections.Generic;
using System.Threading.Tasks;
using DatingApp.API.Models;

namespace DatingApp.API.Data
{
    public interface IDatingRepository
    {
         DatingRepository Add<T>(T entity) where T: class;
         DatingRepository Delete<T>(T entity) where T: class;
         Task<bool> Save();
         Task<IEnumerable<User>> GetUsers();
         Task<User> GetUser(int id);
    }
}