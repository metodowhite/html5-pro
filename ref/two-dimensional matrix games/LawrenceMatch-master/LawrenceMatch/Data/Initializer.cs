using LawrenceMatch.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawrenceMatch.Data
{
    public class Initializer : System.Data.Entity.DropCreateDatabaseIfModelChanges<LmContext>
    {
        protected override void Seed(LmContext context)
        {
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

            foreach (var score in scores)
                context.UserScores.Add(score);

            context.SaveChanges();
        }
    }
}