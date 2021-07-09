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

        [Required(ErrorMessage = "Campo Nome Obrigatório")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Campo Sobrenome Obrigatório")]
        public string Surname { get; set; }
        
        [Required(ErrorMessage = "Campo CPF Obrigatório")]
        public string SocialSecurity { get; set; }

        [Required(ErrorMessage = "Campo Idade Obrigatório")]
        public int Age { get; set; }
        
        [Required(ErrorMessage = "Campo Telefone Obrigatório")]
        public string PhoneNumber { get; set; }
    }
}
