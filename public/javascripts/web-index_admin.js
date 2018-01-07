$('.ico-rank').addClass('ico-admin');
$('.rank-name').text('系统管理员');

$(function(){
	var staffGroup = [];
	var managerGroup = [];
	var ceoGroup = [];
	
	refreshUserList()
	
	$('#addBtn').on('click',function(){
		$('#username').val('');
		$('#rank').val('1');
		$('.directManager-div').show();
		$('#directManager').empty();
		for(let i=0; i<managerGroup.length; i++){
			let option = '<option value="'+ managerGroup[i] +'">'+managerGroup[i]+'</option>';
			$('#directManager').append(option);	
		}
		$('#addNewUser').modal('show');
	});
	
	$('select.rank').change(function(){
		var rank = Number($(this).val());
		var $parent = $(this).parents('.modal-body');
		switch (rank){
			case 1:
				$parent.find('.directManager-div').show();
				$parent.find('.direct-manager').empty();
				for(let i=0; i<managerGroup.length; i++){
					let option = '<option value="'+ managerGroup[i] +'">'+managerGroup[i]+'</option>';
					$parent.find('.direct-manager').append(option);	
				}
				break;
			case 2:
				$parent.find('.directManager-div').show();
				$parent.find('.direct-manager').empty();
				for(let i=0; i<ceoGroup.length; i++){
					let option = '<option value="'+ ceoGroup[i] +'">'+ceoGroup[i]+'</option>';
					$parent.find('.direct-manager').append(option);	
				}
				break;
			case 3:
				$parent.find('.directManager-div').hide();
				break;
			default:
				break;
		}
	});
	
	$('#addNewUser .sureBtn').on('click',addNewUser);
	
	$('#username').on('input',function(){
		$('.repeat-name').fadeOut();
	});
	
	$('#delBtn').on('click',delUser);
	
	$('#editBtn').on('click',function(){
		if($('#userList tbody').find('.checked-tr').length==1){
			var userInfo = $('.checked-tr').data('info');
			$('#editUser .username').val(userInfo.name);
			$('#editUser .position').val(userInfo.position);
			$('#editUser .rank').val(userInfo.rank);
			$('#editUser .rank').change();
			$('#editUser .direct-manager').val(userInfo.manager);
			$('#editUser .sureBtn').data('targetid',userInfo.id);
			$('#editUser').modal('show');
		}else{
			reAlert('删除提示','请选择一条数据!')
		}
	});
	
	$('#editUser .sureBtn').on('click',editUser);
	
	$('#searchUser').on('input',function(){
		
		var $trs = $('#userList tbody').find('tr');
		$('#userList tbody').find('.checked-tr').find('.check-one').attr('checked',false);
		$('#userList tbody').find('.checked-tr').removeClass('checked-tr')
		$trs.removeClass('checked-tr');
		for(var i=0; i<$trs.length; i++){
			if($trs.eq(i).data('info').name.includes($(this).val())){
				$trs.eq(i).show();
			}else{
				$trs.eq(i).hide();
			}
		}
	})
	
	function editUser(){
		var userId = $(this).data('targetid');
		var param = {
			id: $(this).data('targetid'),
			position: $('#editUser .position').val(),
			rank: $('#editUser .rank').val(),
		}
		if(Number($('#editUser .rank').val())!=3){
			param.manager = $('#editUser .direct-manager').val();
		}
		
		$.post('/admin/updateUser',param,function(res){
			console.log(res);
			if(res == 'success'){
				$('.error-bar').text('修改成功！').fadeIn('fast');
				setTimeout(() => {
					$('.error-bar').fadeOut('fast');
				},2500);
				$('#editUser').modal('hide');
				refreshUserList();
			}
		})
		
	}
	
	function delUser(){
		if($('#userList tbody').find('.checked-tr').length==1){
			var userInfo = $('.checked-tr').data('info');
			$.post('/admin/delUser', {"id": userInfo.id}, function(res){
				if(res == 'success'){
					$('.error-bar').text('删除成功！').fadeIn('fast');
					setTimeout(() => {
						$('.error-bar').fadeOut('fast');
					},2500);
					$('.checked-tr').animate({'height':0},200,function(){
						$('.checked-tr').remove();
					});
					delRankGroup(userInfo.rank,userInfo.name);
				}
			})
		}else{
			reAlert('删除提示','请选择一条数据!')
		}
	}
	
	
	function addNewUser(){
		if($('#username').val()){
			var param = {
				"username": $('#username').val(),
				"position": $('#position').val(),
				"rank": $('#rank').val(),
				"manager": $('#directManager').val()
			}
			$.post('/admin/addNewUser', param, function(res){
				if(res == 'success'){
					$('.error-bar').text('添加成功！').fadeIn('fast');
					setTimeout(() => {
						$('.error-bar').fadeOut('fast');
					},2500);
					$('#addNewUser').modal('hide');
					refreshUserList();
					
				}else if(res == 'name_existed'){
					$('.repeat-name').fadeIn('fast');
				}
			})
		}else{
			$('#username').addClass('shake');
			setTimeout(function(){
				$('#username').removeClass('shake');
			},2000);
		}
	}
	
	function refreshUserList(){
		$.post('/admin/getAllUser',function(res){
			$('#userList tbody').empty();
			staffGroup = [];
			managerGroup = [];
			ceoGroup = [];
			res = JSON.parse(res);
			const trRadio = '<tr><td><input type="radio" name="checkOne" class="check-one"/></td>';
			for(var i=0; i<res.length; i++){
				let userInfo = res[i];
				let trStr = trRadio;
				trStr += '<td>'+userInfo.id+'</td>';
				trStr += '<td>'+userInfo.name+'</td>';
				trStr += '<td>'+userInfo.position+'</td>';
				var rank = Number(userInfo.rank);
				switch (rank){
					case 1:
						trStr += '<td data-rank="'+ 1 +'">办事员</td>';
						trStr += '<td>'+ userInfo.manager +'</td></tr>';
						staffGroup.push(userInfo.name);
						break;
					case 2:
						trStr += '<td data-rank="'+ 2 +'">部门主管</td>';
						trStr += '<td>'+userInfo.manager +'</td></tr>';
						managerGroup.push(userInfo.name);
						break;
					case 3:
						trStr += '<td data-rank="'+ 3 +'">主管领导</td>';
						trStr += '<td></td></tr>'
						ceoGroup.push(userInfo.name);
						break;
					default:
						break;
				}
				$(trStr).data('info',userInfo).appendTo('#userList tbody');
			}
			
			$('.check-one').off('click').click(function(){
				if(!$(this).parents('tr').hasClass('checked-tr')){
					$(this).parents('tr').addClass('checked-tr').siblings().removeClass('checked-tr');
				}
			})
			
			$('#userList tbody tr').off('click').click(function(){
				if(!$(this).hasClass('checked-tr')){
					$(this).addClass('checked-tr').siblings().removeClass('checked-tr');
					$(this).find('.check-one').click();
				}
			})
		});
	}
	
	
	function rankTransfer(rank){
		rank = Number(rank);
		switch (rank){
			case 1:
				rank = '办事员'
				break;
			case 2:
				rank = '部门主管'
				break;
			case 3:
				rank = '主管领导'
				break;
			default:
				break;
		}
		return rank;
	}
	
	function delRankGroup(rank,name){
		rank = Number(rank);
		switch (rank){
			case 1:
				var index = staffGroup.indexOf(name);
				if(index>-1){
					staffGroup.splice(index,1);
				}
				break;
			case 2:
				var index = managerGroup.indexOf(name);
				if(index>-1){
					managerGroup.splice(index,1);
				}
				break;
			case 3:
				var index = ceoGroup.indexOf(name);
				if(index>-1){
					ceoGroup.splice(index,1);
				}
				break;
			default:
				break;
		}
	}
	
})
