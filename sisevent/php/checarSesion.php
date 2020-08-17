<?php
  include "login.php";

  if(isset($_SESSION["usuarioInicio"])){
  	echo true;
  }else{
  	echo false;
  }

?>