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

<?lua 
	local function tstring (val, indent, inspect)
		indent = indent or 0
		inspect = inspect or ''

		if type(val) ~= "table" then
	  		inspect = inspect .. tostring(val)
		else
			for k, v in pairs(val) do
				if(k ~= "__newindex") then
			    	local formatting = "<br/>"..string.rep("&nbsp;", indent) .. k .. ": "
			    	inspect = inspect.. formatting 
			    	inspect = tstring(v, indent+8, inspect)    
				end
			end
		end
		return inspect
	end
?>

<table id="sailor_error_inspect">
	<?lua for k,v in pairs(page.trace) do ?>
		<tr>
			<td>
				<%= (string.gsub(tstring(v),"<br/>","",1)) %>
			</td>
		</tr>
	<?lua end ?>
</table>
