using System;
using System.Security.Claims;
using System.Threading.Tasks;
using DatingApp.API.Data;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace DatingApp.API.Helpers
{
    public class UpdateUserLastActive : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            // get context from after action completes
            var resultContext = await next();

            // get userid from Auth token
            var userId = int.Parse(
                resultContext.HttpContext.User.FindFirst(ClaimTypes.NameIdentifier).Value
            );

            // instantiate DatingRepository
            var repo = resultContext.HttpContext.RequestServices.GetService<IDatingRepository>();

            // fetch user from the repository
            var user = await repo.GetUser(userId);

            // update LastActive property of user
            user.LastActive = DateTime.Now;

            // commit to database
            await repo.SaveAll();
        }
    }
}