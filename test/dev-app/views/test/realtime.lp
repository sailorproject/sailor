hi!
<br/>
This is done with JavaScript: 
<div id="time-js">
	0
</div>

<script>
	var start = (new Date()).getTime();
	function timer(){
		var t = document.getElementById("time-js");
		t.innerText = Math.floor(((new Date()).getTime()-start)/1000);
	}
	window.setInterval(timer,1000);
</script>

<code>
	<xmp>
		hi!
		<br/>
		This is done with JavaScript: 
		<div id="time-js">
			0
		</div>

		<script>
			var start = (new Date()).getTime();
			function timer(){
				var t = document.getElementById("time-js");
				t.innerText = Math.floor(((new Date()).getTime()-start)/1000);
			}
			window.setInterval(timer,1000);
		</script>
	</xmp>
</code>