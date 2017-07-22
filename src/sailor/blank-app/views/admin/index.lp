<script>function checkEmpty() {
var valueofId=document.getElementById("pass").value;
if (!valueofId) {
        
        alert("Blank password not allowed. Enter the password set in conf file");
        return false;

    }
}
</script>

<div class="container">
    <div class="row">
        <div class="col-md-offset-4 col-md-3">
            
            <form method="post">
            <div class="form-login">
            <h4>Login to Admin Center</h4>
            <input type="password" id="pass" name="password" class="form-control input-sm chat-input" placeholder="Admin password set in config file" />
            </br>
            <input type="submit" class="btn btn-primary btn-md" onclick="return checkEmpty();"/>
            </form>
            </div>
            <?lua page:print(msg) ?>
        
        </div>
    </div>
</div>
