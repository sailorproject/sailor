<?lua 
local conf = require "conf.conf"
?>

<div class="modal-body row">
  <div class="col-md-5">
  <h4>Autogen Functions</h4>
<h5><u>Generate Model</u></h5>
  <form method="post">
  <input type=text placeholder="Table Name..." name="table_name" class="form-control"/><br>
  <input type="submit" class="btn btn-primary" />
  </form>
<font color="red">
<?lua if modelgen then ?>
  Model generated with success!
<?lua end ?>
</font>
<br/><br/>

<h5><u>Generate CRUD</u></h5>

  <form method="post">
    <input type=text placeholder="Model Name..." name="model_name" class="form-control"/><br>
    <input type="submit" class="btn btn-primary"/>
  </form>
<font color="red">
<?lua if crudgen then ?>
  CRUD generated with success!
<?lua end ?>
</font>

  </div>
<div class="col-md-1">
<a href="?r=admin/logout" class="btn btn-info" role="button">Logout</a>
</div>

  <div class="col-md-6">
    <h4>Config Editor</h4>
    <font color="red"><?lua if test then page:print(test) end?></font>
    <form method="post" class="form-horizontal" role="form">

<h5><u>Sailor Settings</u></h5>
<?lua for k,v in pairs(conf.sailor) do ?>

  <div class="form-group">
    <label class="control-label col-sm-2"><%= tostring(k) %></label>
    <div class="col-sm-12">
      <input type="text" class="form-control" name="<%= tostring(k) %>" value="<%= tostring(v) %>">
    </div>
  </div>

<?lua end ?>

<h5><u>Database Settings</u></h5>

<?lua for k,v in pairs(conf.db) do ?>
  <?lua for i,j in pairs(v) do ?>
  
  <div class="form-group">
    <label class="control-label col-sm-1"><%= tostring(i) %></label>
    <div class="col-sm-12">
      <input type="text" class="form-control"  name="<%= tostring(i) %>" value="<%= tostring(j) %>">
    </div>
  </div>

  <?lua end ?>
<?lua end ?>

<h5><u>Mail Server Settings</u></h5>

<?lua for k,v in pairs(conf.smtp) do ?>
  <div class="form-group">
    <label class="control-label col-sm-1"><%= tostring(k) %></label>
    <div class="col-sm-12">
      <input type="text" class="form-control"  name="<%= tostring(k) %>" value="<%= tostring(v) %>">
    </div>
  </div>
<?lua end ?>

<div class="form-group">
    <label class="control-label col-sm-3"><u>Lua At client VM</u></label>
    <div class="col-sm-12">
      <input type="text" class="form-control"  name="lua_at_client" value="<%= conf.lua_at_client.vm %>">
    </div>
  </div>
<div class="form-group">
    <label class="control-label col-sm-3"><u>Debug Mode</u></label>
    <div class="col-sm-12">
      <input type="text" class="form-control"  name="debug" value="<%= tostring(conf.debug.inspect) %>">
    </div>
 </div>

<input type="submit" class="btn btn-primary btn-md" />
</form>

  </div>
</div>
