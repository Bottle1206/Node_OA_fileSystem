function transferFState(status) {
	var obj = {};
	status = Number(status);
	switch(status) {
		case 0:
			obj.val = "待阅";
			obj.group = 0;
			break;
		case 1:
			obj.val = "等待部门主管处理";
			obj.group = 0;
			break;
		case 21:
			obj.val = "被部门主管通过";
			obj.group = 0;
			break;
		case 20:
			obj.val = "被部门主管驳回";
			obj.group = 2;
			break;
		case 30:
			obj.val = '等待主管领导处理';
			obj.group = 0;
			break;
		case 41:
			obj.val = '被主管领导同意';
			obj.group = 1;
			break;
		case 40:
			obj.val = '被主管领导驳回';
			obj.group = 2;
			break;
		default:
			break;
	}
	return obj;
}

$('.ico-rank').addClass('ico-staff');
$('.rank-name').text('办事员 ');

$(function() {
	var timeOut;
	//所有文件名
	var fileNameList = [];
	//所有任务名
	var taskNameList = [];
	//用户名
	var STAFFname = getUserName();
	
	//获取该职员的所有文件
	$.post('/staff/getMyFile', {staff: STAFFname}, function(res) {
		var fileObj = groupByStatus(res);
		if(fileObj.complete){
			$('.li-complete>ul').empty();
			$('.li-complete .amount-span').text(fileObj.complete.length);
			for(let i=0; i<fileObj.complete.length; i++){
				let file = fileObj.complete[i];
				let row_file = createRowStr(file);
				$(row_file).data('statuslist',file.statusList).appendTo('.li-complete>ul')
			}
		}
		
		if(fileObj.underway){
			$('.li-underway>ul').empty();
			$('.li-underway .amount-span').text(fileObj.underway.length);
			for(let i=0; i<fileObj.underway.length; i++){
				let file = fileObj.underway[i];
				let row_file = createRowStr(file);
				$(row_file).data('statuslist',file.statusList).appendTo('.li-underway>ul')
			}
		}
		
		if(fileObj.reject){
			$('.li-reject').show();
			$('.li-reject>ul').empty();
			$('.li-reject .amount-span').text(fileObj.reject.length);
			var openBtn = '<span class="open-btn"></span>';
			var updateBtn = '<button type="button" class="btn btn-sm btn-danger update-btn">更新</button>';
			for(var i=0; i<fileObj.reject.length; i++){
				var file = fileObj.reject[i];
				var State = file.status;
				var row_file = '<li class="row-files" id="File-' + file.id + '" data-time="'+ file.time +'">'; 
				row_file += '<div class="col-sm-3 file-title">'+ file.title + '</div>';
				row_file += '<div class="col-sm-4 file-name">'+ file.filename + '</div>';
				row_file += '<div class="col-sm-4 file-status">'+ transferFState(State).val +' / '+ file.time + openBtn+'</div>';
				row_file += '<div class="col-sm-1 text-center">'+updateBtn+'</div>';
				row_file += '</li>';
				$(row_file).data('statuslist',file.statusList).appendTo('.li-reject>ul')
			}
			$('.update-btn').on('click',ClickUpdateBtn);
		}else{
			$('.li-reject').hide();
		}
		
		$('.open-btn').on('click',showStatuList);
		
	})
	
	$('#updateInput').on('change', updateFile);
	
	$('#btnSub').on('click', uploadFile);
	
	//点击选择上传文件
	$('.upload-name').click(function(){
		$('#fulAvatar').click();
	});
	
	$('#fulAvatar').on('change',function(){
		var filename = $(this).val().replace(/\S{1,}\\/g,'');
		if(filename){
			$('#filePath').css({'color':'#d70141',"fontSize":'14px'}).text(filename);
		}else{
			$('#filePath').css({'color':'#006498',"fontSize":'13px'}).text("未选择任何文件");
		}
	});
	
	$('.upload-name').hover(function(){
		$(this).find('.left').toggleClass('left-hover');
		$(this).find('#filePath').toggleClass('filepath-hover');
	})
	
	function groupByStatus(res){
		var fileObj = {}
		res = JSON.parse(res);
		res = sortByTime(res);
		for(var i=0; i<res.length; i++){
			var resObj = res[i];
			fileNameList.push(resObj.filename);
			taskNameList.push(resObj.title);
			var statusTime = resObj.statusTime;
			var statusTimeInfo = statusTime[statusTime.length - 1];
			var status = Number(statusTimeInfo.status);
			var reObj = {
				id: resObj.id,
				title: resObj.title,
				filename: resObj.filename,
				status: status,
				time: statusTimeInfo.time,
				statusList: statusTime//array[obj]
			}
			var stautsGroup = transferFState(status).group;
			if(stautsGroup == 0){//进行中
				if(!fileObj.underway){
					fileObj.underway = [];
				}
				fileObj.underway.push(reObj);
			}else if(stautsGroup == 1){//已完成 status 41
				if(!fileObj.complete){
					fileObj.complete = [];
				}
				fileObj.complete.push(reObj);
			}else{//被驳回
				if(!fileObj.reject){
					fileObj.reject = [];
				}
				fileObj.reject.push(reObj);
			}
		}
		return fileObj;
	}
	
	function createRowStr(file){
		var openBtn = '<span class="open-btn"></span>';
		var row_file = '<li class="row-files" data-time="'+ file.time +'">'; 
		row_file += '<div class="col-sm-3 file-title">'+ file.title + '</div>';
		row_file += '<div class="col-sm-4 file-name">'+ file.filename + '</div>';
		row_file += '<div class="col-sm-4 file-status">'+ transferFState(file.status).val +' / '+ file.time +'</div>';
		row_file += '<div class="col-sm-1 text-center">'+ openBtn +'</div>';
		row_file += '</li>';
		return row_file;
	}
	
	function showStatuList(){
		var statusList = $(this).parents('.row-files').data('statuslist');
		$('#showStatusList .file-title').text($(this).parent().siblings('.file-title').text());
		$('#showStatusList .file-name').text($(this).parent().siblings('.file-name').text());
		$('#showStatusList .status-list').empty()
		for(var i=0; i<statusList.length && i<5; i++){
			var statusRow = statusList[i];
			var status_row = '<li class="row">'+
							 '<div class="col-sm-5 status-time ">'+ statusRow.time + '</div>'+
				             '<div class="col-sm-7 status-res">'+ transferFState(statusRow.status).val;
			if(i==2){
				status_row += '</div><div class="detail-hover"><span class="send-btn"></span><label>部门主管的回复：</label>'+ statusRow.managerTip;
			}else if(i==4){
				status_row += '</div><div class="detail-hover"><span class="send-btn"></span><label>主管领导的回复：</label>'+ statusRow.ceoTip;
			}
			status_row += '</div></li>';
			$('#showStatusList .status-list').append(status_row);				 
		}
		$('.send-btn').click(function(){
			var $hover = $(this).parent();
			$hover.stop();
			if($hover.css('left')=="798px"){
				$(this).addClass('position-back');
				$(this).parent().animate({"left":0},500,function(){
					$(this).parents('li').addClass('li-behover');
				});
			}else{
				$(this).removeClass('position-back');
				$(this).parents('li').removeClass('li-behover');
				$(this).parent().animate({"left":"798px"},500);
			}
		})
		$('#showStatusList').modal('show');
	}
	
	function fakeShowStatuList(){
		var $thisParent = $(this).parent();
		$('#showStatusList .file-title').text($thisParent.siblings('.file-title').text());
		$('#showStatusList .file-name').text($thisParent.siblings('.file-name').text());
		$('#showStatusList .status-list').empty();
		var time = $thisParent.siblings('.file-status').text().split('/')[1];
		var status_row = '<li class="row"><div class="col-sm-5 status-time ">'+ time +'</div>'+
						 '<div class="col-sm-7 status-res">待阅</div></li>';
		$('#showStatusList .status-list').append(status_row);
		$('#showStatusList').modal('show');
	}
	
	function ClickUpdateBtn(){
		var $this = $(this);
		reConfirm('更新提示','确认更新',function(r){
			if(r){
				var id = $this.parents('.row-files').attr('id').split('-')[1];
				var oldfile = $this.parent().siblings('.file-name').text();
				var title = $this.parent().siblings('.file-title').text();
				var target = {
					id:id,
					oldfile:oldfile,
					title:title
				}
				$('#updateInput').data('target',target);
				//触发自动上传文件的选择文件弹框；
				$('#updateInput').click();//选择后自动触发“change”事件
			}
		})
	}
	
	function uploadFile(){
		var title = $('#taskName').val();
		if(title){
			var filename = $('#filePath').text();
			if(filename != '未选择任何文件' && filename!=''){
				if(!taskNameList.includes(title)){
					if(/.(doc|docx)$/.test(filename)) {
						if(!fileNameList.includes(filename)){//判断文件名是否同名
							var form = new FormData(document.getElementById("formData"));
							form.append('taskName',title)
							$.ajax({
								url: '/staff',
								type: 'post',
								data: form,
								processData: false,
								contentType: false,
								success: function(res) {
									if(res=="upload_success"){
										showTopError('上传成功！')
										var obj = {
											title:title,
											filename:filename
										}
										$('#taskName').val('')
										$('#filePath').css({'color':'#006498',"fontSize":'13px'}).text("未选择任何文件");
										addNewLi(obj);
									}else{
										showTopError('上传失败！');
									}
								},
								error: function(err) {
									console.error(err);
								}
							})
						} else {
							showTopError('该文件已存在！');
						}
					}else{
						showTopError('文件类型不支持！');
					}
				}else{
					showTopError("该任务名已存在！")
				}
			}else{
				showTopError("请选择要上传的文件！")
			}
		}else{
			showTopError('任务名不能为空');
		}
	}
	
	function updateFile(){
		var id = $(this).data('target').id;
		var title = $(this).data('target').title;
		var oldfileName = $(this).data('target').oldfile;
		if($(this).val()){
			var index = fileNameList.indexOf(oldfileName);
			fileNameList.splice(index,1);
			var filename = $(this).val().replace(/\S{1,}\\/g,'');
			if(!fileNameList.includes(filename)){
				if(/.(doc|docx)$/.test(filename)) {
					//这是删除操作
					$.post('/staff/delFile',{id:id},function(res){
						if(res == "delFile_success"){
							var form = new FormData(document.getElementById("updateForm"));
							form.append('taskName', title)
							$.ajax({
								url: '/staff',
								type: 'post',
								data: form,
								processData: false,
								contentType: false,
								success: function(res) {
									if(res=="upload_success"){
										showTopError('更新成功！');
										$('#File-'+id).animate({'height':'0'},200,function(){
											$(this).remove();
											if($('.li-reject > ul').find('.row-files').length == 0){
												$('.li-reject').fadeOut('fast');
											}
										});
										var obj = {
											title: title,
											filename:filename
										}
										addNewLi(obj);
									}else{
										showTopError('更新失败！');
									}
								},
								error: function(err) {
									console.error(err);
									showTopError('更新失败！');
								}
							})
						}
					})
				}else{
					showTopError('文件类型不支持！');
				}
			}else{
				showTopError("该文件已存在");
			}
		}
	}
	
	function addNewLi(file){
		var title = file.title;
		var filename = file.filename;
		var newSign = '<label class="red-sign"></label>';
		var fake_openBtn = '<span class="fake-open-btn"></span>';
		file.time = getNowTime();
		var row_file = '<li class="row-files" data-time="'+ file.time +'">'+newSign; 
		row_file += '<div class="col-sm-3 file-title">'+ title + '</div>';
		row_file += '<div class="col-sm-4 file-name">'+ filename + '</div>';
		row_file += '<div class="col-sm-4 file-status">待阅 / '+ file.time + '</div>';
		row_file += '<div class="col-sm-1 text-center">'+fake_openBtn+'</div>';
		row_file += '</li>';
		$('.li-underway>ul').prepend(row_file).find('.empty').hide();
		$('.fake-open-btn').off('click').on('click',fakeShowStatuList);
		if(!fileNameList.includes(filename)){
			fileNameList.push(filename);
		}
		if(!taskNameList.includes(title)){
			taskNameList.push(title);
		}
	}
	
	function showTopError(str){
		clearTimeout(timeOut);
		$('.error-bar').text(str).fadeIn('fast');
		timeOut = setTimeout(function(){
			$('.error-bar').fadeOut();
		},2500)
	}
	
})
