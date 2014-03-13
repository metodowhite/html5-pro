using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace LawrenceMatch.Models
{
    public class UserScore
    {
        public int Id { get; set; }
        [Required]
        public int Score { get; set; }
        [Required]
        public string Name { get; set; }
        public string Test { get; set; }
        public List<int> GameStates { get; set; }
        public int NumHints { get; set; }
        public DateTime? DateCreated { get; set; }
    }
}