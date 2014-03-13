namespace LawrenceMatch.Migrations
{
    using LawrenceMatch.Models;
    using System;
    using System.Collections.Generic;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<LawrenceMatch.Data.LmContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
            ContextKey = "LawrenceMatch.Data.LmContext";
        }

        protected override void Seed(LawrenceMatch.Data.LmContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
            var scores = new List<UserScore> {
                new UserScore {
                    Name = "Jennifer",
                    Score = 100,
                    DateCreated = DateTime.Now
                },
                new UserScore {
                    Name = "Joey",
                    Score = 600,
                    DateCreated = DateTime.Now
                },
                new UserScore {
                    Name = "Fishburn",
                    Score = 400,
                    DateCreated = DateTime.Now
                }
            };
        }
    }
}
