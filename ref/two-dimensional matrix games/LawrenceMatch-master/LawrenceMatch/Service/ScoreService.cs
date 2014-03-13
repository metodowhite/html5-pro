using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LawrenceMatch.Service
{
    public static class ScoreService
    {
        // 
        // This does the same checking that done client slide in VerifyScore()
        public static bool ScoreIsValid(List<int> states, int numHints, int score) 
        {
            var calculatedScore = 0;
            foreach (var state in states)
                calculatedScore += CalculateScore(state);
            calculatedScore -= (100 * numHints);

            return calculatedScore == score;

        }

        public static int CalculateScore(int num)
        {
            return ((num - 3) * 20) + num * 10;
        }
    }
}