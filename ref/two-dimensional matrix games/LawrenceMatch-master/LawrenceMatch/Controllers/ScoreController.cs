using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;
using LawrenceMatch.Models;
using LawrenceMatch.Data;

namespace LawrenceMatch.Controllers
{
    [Authorize]
    public class ScoreController : Controller
    {
        private LmContext db = new LmContext();

        // GET: /Score/
        public ActionResult Index()
        {
            return View(db.UserScores.ToList());
        }

        // GET: /Score/Details/5
        public ActionResult Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserScore userscore = db.UserScores.Find(id);
            if (userscore == null)
            {
                return HttpNotFound();
            }
            return View(userscore);
        }

        // GET: /Score/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /Score/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create([Bind(Include="Id,Score,Name")] UserScore userscore)
        {
            if (ModelState.IsValid)
            {
                db.UserScores.Add(userscore);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(userscore);
        }

        // GET: /Score/Edit/5
        public ActionResult Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserScore userscore = db.UserScores.Find(id);
            if (userscore == null)
            {
                return HttpNotFound();
            }
            return View(userscore);
        }

        // POST: /Score/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit([Bind(Include="Id,Score,Name")] UserScore userscore)
        {
            if (ModelState.IsValid)
            {
                db.Entry(userscore).State = EntityState.Modified;
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(userscore);
        }

        // GET: /Score/Delete/5
        public ActionResult Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            UserScore userscore = db.UserScores.Find(id);
            if (userscore == null)
            {
                return HttpNotFound();
            }
            return View(userscore);
        }

        // POST: /Score/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public ActionResult DeleteConfirmed(int id)
        {
            UserScore userscore = db.UserScores.Find(id);
            db.UserScores.Remove(userscore);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
