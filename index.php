<?php

    define("DB_SERVER", "localhost");
    define("DB_USER", "root");
    define("DB_PASS", "");
    define("DB_NAME", "bond");

    $connection = mysqli_connect(DB_SERVER,DB_USER,DB_PASS,DB_NAME);
    if (mysqli_connect_errno()) {
        die ("Database connection failed" . mysqli_connect_error() . " (" . mysqli_connect_error() . ")");
    }

?>

<!doctype <!DOCTYPE html>
<html>
<head>
	<title>The locations of James Bond</title>
	<meta chatset="utf-8">
	<meta name="description" content="James Bond Interactive Map">
	<meta name="keywords" content="James Bond Interactive Map">
	<meta http-equiv="Cache-control" content="public">
	<script src="http://maps.googleapis.com/maps/api/js?key=AIzaSyDHC1Wqz3_QJ8oKnkCbBb0sffeje3M16dc&libraries=geometry"></script>
    <script type="text/javascript" src="googlescripts.js"></script>
    <script type="text/javascript" src="jquery.js"></script>
	<script type="text/javascript" src="script.js"></script>
	<link rel="stylesheet" type="text/css" href="normalize.css">
    <link rel="stylesheet" type="text/css" href="fonts.css">
    <link rel="stylesheet" type="text/css" href="style.css">
</head>


<body>
	<section id="sectionone">
    <img src="img/down.png" class="down">
        <div id="informationslider">
            <img src="img/closeinfowindow.png" id="closemodalwindow">
            <h3 id="info1"></h3>
            <h3 id="info2"></h4>
            <h3 id="info3"></h4>
            <h3 id="info4"></h4>
            <p id="info5"></p>
            <h3 id="info6"></h4>
        </div>
		<div id="map"></div>
            <div id="mainsidebar">
                <h1>The locations of James Bond</h1>
                <nav id="mainnav">
                    <ul id="selectfilm">
                        <?php
                            
                            global $connection;

                            $query = "SELECT DISTINCT film ";
                            $query .= "FROM bond_film_data ";
                            $films = mysqli_query($connection, $query);

                            if(!$films) {
                                die("Database query error");
                            }
                            
                            while ($film = mysqli_fetch_assoc($films)) {
                                echo "<li><a onclick='ajax_request_to_turn_markers_on_and_off(\"";
                                echo $film['film'];
                                echo "\",this);'\">";
                                echo $film['film'];
                                echo "</a></li>";
                            }
                            mysqli_free_result($films);

                        ?>
                            
                        <ul>
                </nav>
            </div>
	</section>
    
    <section id="sectiontwo">
    <img src="img/up.png" class="up">
    <img src="img/down.png" class="down">
    </section>
    
    <section id="sectionthree">
    <img src="img/up.png" class="up">
    <img src="img/down.png" class="down">
    </section>
    
    <section id="sectionfour">
    <img src="img/up.png" class="up">
    </section>

</body>
</html>
