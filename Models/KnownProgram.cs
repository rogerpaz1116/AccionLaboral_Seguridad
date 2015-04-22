﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace AccionLaboral.Models
{
    public class KnownProgram
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)] 
        public int KnownProgramId { get; set; }
        [Required]
        public string Name { get; set;  }
        
        public int ClientId { get; set; }

        public Client Client { get; set; }
    }
}
