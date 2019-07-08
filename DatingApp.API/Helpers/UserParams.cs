namespace DatingApp.API.Helpers
{
    public class UserParams
    {
        public const int DefaultMinAge = 18;
        public const int DefaultMaxAge = 999;
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 10;

        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value; }
        }

        public int UserId { get; set;}
        public string Gender { get; set; }
        public int MinAge { get; set; }
        public int MaxAge { get; set; }

        public UserParams()
        {
            this.MinAge = DefaultMinAge;
            this.MaxAge = DefaultMaxAge;
        }

        public string OrderBy { get; set; } = "LastActive";
    }
}