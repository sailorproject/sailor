<style type="text/css">
	#sailor_error_inspect{
		border-style: solid;
    	border-width: 5px;
    	width: 100%;
	}
	#sailor_error_inspect td{
	    padding: 10px;
	}
	#sailor_error_inspect tr{
		background: #ddd;
	}
	#sailor_error_inspect tr:nth-child(odd){ 
		background: #ddd;
	}
	#sailor_error_inspect tr:nth-child(even){
		background: #fff;
	}
</style>

<table id="sailor_error_inspect">
	<?lua for k,v in pairs(page.trace) do ?>
		<tr>
			<td>
				<%= (string.gsub(page:tostring(v),"<br/>","",1)) %>
			</td>
		</tr>
	<?lua end ?>
</table>
