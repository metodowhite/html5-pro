using LawrenceMatch.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace LawrenceMatch.Controllers
{
    public class HomeController : Controller
    {
        private LmContext db = new LmContext();

        public ActionResult Index()
        {
            ViewBag.Title = "Lawrence Match";

            ViewBag.HighScore = db.UserScores
                .OrderByDescending(s => s.Score)
                .FirstOrDefault();

            return View();
        }

        public ActionResult Game()
        {
            return View();
        }
    }
}
