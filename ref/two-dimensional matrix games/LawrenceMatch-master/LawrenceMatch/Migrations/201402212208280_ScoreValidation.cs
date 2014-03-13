namespace LawrenceMatch.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ScoreValidation : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.UserScores", "NumHints", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.UserScores", "NumHints");
        }
    }
}
