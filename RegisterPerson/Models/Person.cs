using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace RegisterPerson.Models
{
    public class Person
    {
        public int PersonId { get; set; }

        [Required(ErrorMessage = "Nome Obrigatório")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Sobrenome Obrigatório")]
        public string Surname { get; set; }
        
        [Required(ErrorMessage = "CPF Obrigatório")]
        public string SocialSecurity { get; set; }

        [Required(ErrorMessage = "Idade Obrigatório")]
        public int Age { get; set; }
        
        [Required(ErrorMessage = "CPF Obrigatório")]
        public string PhoneNumber { get; set; }
    }
}
