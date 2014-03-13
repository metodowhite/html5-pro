<?php
session_start();
error_reporting(E_ALL);
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json');

/*We're going to store the score as an object of class Score.  We can do different things with a score:
1) We can store a score.
2) We can retrieve a list of the last 10 high scores.*/

class Score implements JsonSerializable {

	private $score;
	private $user;
	private $highScores = array();
	private $userID;

	private $pdo;

    public function __construct($pdo, $user = "", $score = "") {
    	$this->setUser($user);
        $this->setScore($score);
        $this->pdo = $pdo;
    }

	public function setUser($user){
		$this->user = trim($user);
	}
	public function getUser(){
		return $this->user;
	}

	public function setScore($score){
		$this->score = trim($score);
	}
	public function getScore(){
		return $this->score;
	}

	public function storeScore(){
		$params = array(
			":user"=>$this->user,
			":score"=>$this->score
			);

		if (array_key_exists("userID",$_SESSION)){
			$params[":id"] = $_SESSION['userID'];		
			$pdoStatement = $this->pdo->prepare("UPDATE bejeweled_score SET user=:user, score=:score WHERE id=:id");
			$pdoStatement->execute($params);
		}else{
			$pdoStatement = $this->pdo->prepare("INSERT INTO bejeweled_score (user, score) VALUES (:user, :score)");
			$pdoStatement->execute($params);
			$this->userID = $this->pdo->lastInsertId('id');
			$_SESSION['userID'] = $this->userID;		
		}
	}

	public function getHighScores(){
		$statement = "SELECT user, score FROM bejeweled_score ORDER BY score DESC LIMIT 0, 10";

		foreach ($this->pdo->query($statement) as $row){
			$this->highScores[] = $row;
		}
	}

    public function jsonSerialize(){
    	if ($this->user != ""){
	        return [
	       		"user" => $this->user,
	        	"score" => $this->score
	        ];
	    }
        else
        {
        	return [
        		"highScores" => $this->highScores
        	];
        }
    }
}

$error = false;
$errorMsg = "";
$method = "";

$host = "localhost";
$dbType = "mysql";
$dbUser = "root";
$dbPass = "mysqlpassword";
$db = "peek.com";

try{
	$pdo = new PDO("$dbType:host=$host;dbname=$db", $dbUser, $dbPass);
}catch (PDOException $e){
	$errorMsg = "Could not connect to server: ".$e->getMessage();
	die($errorMsg);
}

if (array_key_exists("method",$_POST)) $method = $_POST['method'];

//For debugging purposes
/*
if (!array_key_exists("user",$_POST)) $_POST['user'] = "t1estuser";
if (!array_key_exists("score",$_POST)) $_POST['score'] = "500";
if ($method == "") $method = "store";
*/

if ($method == "store"){
	$score = new Score($pdo, $_POST['user'], $_POST['score']);
	$score->storeScore();
    print json_encode($score);
}

if ($method == "highScores"){
	$score = new Score($pdo);
	$score->getHighScores();
	print json_encode($score);
}
?>