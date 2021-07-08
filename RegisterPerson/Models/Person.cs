using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RegisterPerson.Models
{
    public class Person
    {
        public int PersonId { get; set; }

        public string Name { get; set; }

        public string SurName { get; set; }
        
        public string SocialSecurity { get; set; }

        public int Age { get; set; }

        public string PhoneNumber { get; set; }
    }
}
