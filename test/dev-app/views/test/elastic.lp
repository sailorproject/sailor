<?lua local form = require "sailor.form" ?>

<form method="post">
  	<h4>Search box</h4>
        <input type="text" id="search" name="search" />
        <input type="submit" class="btn btn-primary btn-md"/>
</form>

<?lua 
page:print(msg)
?>
