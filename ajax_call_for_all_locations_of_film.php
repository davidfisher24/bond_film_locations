<?php

	define("DB_SERVER", "localhost");
    define("DB_USER", "root");
    define("DB_PASS", "");
    define("DB_NAME", "bond");

    $connection = mysqli_connect(DB_SERVER,DB_USER,DB_PASS,DB_NAME);
    if (mysqli_connect_errno()) {
        die ("Database connection failed" . mysqli_connect_error() . " (" . mysqli_connect_error() . ")");
    }



    $film = $_POST['film'];


	$query = "SELECT * ";
	$query .= "FROM bond_film_data ";
	$query .= "WHERE film = '$film' ";
	$data = mysqli_query($connection, $query);

	if(!$data) {
		die("Database query error");
	}

	$array = array();

	while($row = mysqli_fetch_assoc($data)){
	  $array[] = $row;
	}

	echo json_encode($array);
?>