<?lua 
local conf = require "conf.conf"
?>

<div class="modal-body row">
  <div class="col-md-6">
  Autogen Functions


  </div>



  <div class="col-md-6">
    <h4>Config Editor</h4>
    <%= test %>
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

<?lua for k,v in pairs(conf.db.development) do ?>
  <div class="form-group">
    <label class="control-label col-sm-1"><%= tostring(k) %></label>
    <div class="col-sm-12">
      <input type="text" class="form-control"  name="<%= tostring(k) %>" value="<%= tostring(v) %>">
    </div>
  </div>


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