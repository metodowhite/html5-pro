using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using LawrenceMatch.Models;
using LawrenceMatch.Data;
using LawrenceMatch.Service;
using Newtonsoft.Json;
using System.Web.Mvc;

namespace LawrenceMatch.Controllers
{
    public class ScoreApiController : ApiController
    {
        private LmContext db = new LmContext();

        // GET api/ScoreApi
        public IQueryable<UserScore> GetUserScores()
        {
            return db.UserScores;
        }

        // GET api/ScoreApi/5
        [ResponseType(typeof(UserScore))]
        public IHttpActionResult GetUserScore(int id)
        {
            UserScore userscore = db.UserScores.Find(id);
            if (userscore == null)
            {
                return NotFound();
            }

            return Ok(userscore);
        }

        // PUT api/ScoreApi/5
        public IHttpActionResult PutUserScore(int id, UserScore userscore)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != userscore.Id)
            {
                return BadRequest();
            }

            db.Entry(userscore).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserScoreExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/ScoreApi
        [ResponseType(typeof(UserScore))]
        public IHttpActionResult PostUserScore([FromBody]UserScore userscore)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (!ScoreService.ScoreIsValid(userscore.GameStates, userscore.NumHints, userscore.Score))
            {
                // In the real world I'd return an error
                return Ok<string>("Invalid score");
            }



            userscore.DateCreated = DateTime.Now;
            db.UserScores.Add(userscore);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = userscore.Id }, userscore);
        }

        // DELETE api/ScoreApi/5
        [ResponseType(typeof(UserScore))]
        public IHttpActionResult DeleteUserScore(int id)
        {
            UserScore userscore = db.UserScores.Find(id);
            if (userscore == null)
            {
                return NotFound();
            }

            db.UserScores.Remove(userscore);
            db.SaveChanges();

            return Ok(userscore);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool UserScoreExists(int id)
        {
            return db.UserScores.Count(e => e.Id == id) > 0;
        }
    }
}