<?php
	define("DB_SERVER", "localhost");
    define("DB_USER", "root");
    define("DB_PASS", "");
    define("DB_NAME", "bond");

    $connection = mysqli_connect(DB_SERVER,DB_USER,DB_PASS,DB_NAME);
    if (mysqli_connect_errno()) {
        die ("Database connection failed" . mysqli_connect_error() . " (" . mysqli_connect_error() . ")");
    }

	$query = "SELECT * ";
	$query .= "FROM bond_film_data ";
	$data = mysqli_query($connection, $query);

	if(!$data) {
		die("Database query error");
	}

?>

<!doctype html>
<html>
<head>
	<style>
		th {
			font-size:1.2rem;
			padding:6px;
		}

		td {
			padding:6px;
			font-family:verdana;
		}
	</style>
</head>
<body>

	<table>
		<tr>
			<th>ID</th>
			<th>Film</th>
			<th>Setting</th>
			<th>Setting_lat</th>
			<th>Setting_lng</th>
			<th>Setting_details</th>
			<th>Filming</th>
			<th>Filming_lat</th>
			<th>Filming_lng</th>
			<th>Filming_details</th>
			<th>Year</th>
			<th>Bond</th>
		</tr>

		<?php
			while($row = mysqli_fetch_assoc($data)){
			  echo "<tr>";
			  echo "<td>".$row["id"]."</td>";
			  echo "<td>".$row["film"]."</td>";
			  echo "<td>".$row["setting"]."</td>";
			  echo "<td>".$row["setting_lat"]."</td>";
			  echo "<td>".$row["setting_lng"]."</td>";
			  echo "<td>".$row["setting_details"]."</td>";
			  echo "<td>".$row["filming"]."</td>";
			  echo "<td>".$row["filming_lat"]."</td>";
			  echo "<td>".$row["filming_lng"]."</td>";
			  echo "<td>".$row["filming_details"]."</td>";
			  echo "<td>".$row["year"]."</td>";
			  echo "<td>".$row["bond"]."</td>";
			  echo "</tr>";
			}
		?>

	</table>

<body>
<html>