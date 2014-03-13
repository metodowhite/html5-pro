using LawrenceMatch.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;
using System.Linq;
using System.Web;

namespace LawrenceMatch.Data
{
    public class LmContext : DbContext
    {
        public LmContext()
            : base("DefaultConnection")
        {
        }

        public DbSet<UserScore> UserScores { get;set; }


        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            //modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}