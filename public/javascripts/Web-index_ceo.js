$('.ico-rank').addClass('ico-ceo');
$('.rank-name').text('主管领导 ');
var USERNAME = localStorage.getItem('username');

$(function() {
	refreshFiles();
	
	//经理回复：通过
	$('#Pass').on('click',function(){
		respondFile(true);
	});
	
	$('#NoPass').on('click',function(){
		respondFile(false);
	});	
	
	function downLoadFile(){
		var $thisParent = $(this).parent();
		var fileId = $thisParent.parent().attr('id').split('-')[1];
		var filename = $thisParent.siblings('.file-name').text();
		var staff = $thisParent.siblings('.staff-name').text();
		var statusStr = $thisParent.siblings('.file-status').text();
		if(statusStr == "待阅"){
			$.post('/setStatusTime',{
				id: fileId,
				status: 30
			},function(res){
				if(res == "setStatusTime_success"){
					window.location.href = "/avatar/" + staff + "/" + filename;
					setTimeout(function(){
						$thisParent.siblings('.file-status').text("已下载");
						$thisParent.find('.btn-dealfile').removeAttr('disabled');
					},1000);
				}else{
					console.error("下载失败！");
				}
			})
		}else{
			window.location.href = "/avatar/" + staff + "/" + filename;
		}
	}
	
	function dealFile(){
		var $thisParent = $(this).parent();
		var targetId = $(this).parents('.row-files').attr('id').split('-')[1];
		$('#dealFileModal .modal-title').text($thisParent.siblings('.staff-name').text());
		$('#dealFileModal .file-name').text($thisParent.siblings('.file-name').text());
		$('#dealFileModal .file-title').text($thisParent.siblings('.file-title').text());
		$('#dealFileModal').data('targetId', targetId);
		$('#dealFileModal').modal('show');
	}
	
	function respondFile(flag){
		$('#dealFileModal').modal('hide')
		$('#dealPwdModal').addClass('in').show().prepend('<div class="modal-backdrop fade in"></div>');
		$('#dealPwdModal .cancelBtn, #dealPwdModal .close-btn').off('click').click(function(){
			$('#dealPwdModal').removeClass('in').hide().find('.modal-backdrop').remove();
			$('#dealFileModal').modal('show');
		});
		$('#dealPwdModal .sureBtn').off('click').click(function(){
			$('#dealPwd').removeClass('shake');
			if($('#dealPwd').val()){
				$.post('/checkDealPwd',{
					"username": USERNAME,
					"dealPwd": $('#dealPwd').val()
				},function(res){
					if(res == 'success'){
						var id = $('#dealFileModal').data('targetId');
						if(flag){//通过
							var StatusVal = 41;
						}else{//不通过
							var StatusVal = 40;
						}
						var newStatus = {
							id: id,
							status: StatusVal,
							ceoTip: $('#suggest').val()
						}
						$.post('/setStatusTime',newStatus,function(res){
							if(res == "setStatusTime_success"){
								refreshFiles();
							}else{
								console.error("发生未知错误！")
							}
							$('#dealPwdModal').removeClass('in').hide().find('.modal-backdrop').remove();
							
						})
					}else{
						console.log("密码错误");
						$('#dealPwd').addClass('shake');
						setTimeout(function(){
							$('#dealPwd').removeClass('shake');
						},2500);
					}
				})
			}else{
				console.log("请输入密码！");
				$('#dealPwd').addClass('shake');
				setTimeout(function(){
					$('#dealPwd').removeClass('shake');
				},2500);
			}
			
			
		})
		$('#dealPwdModal').keydown(function(e){
			if(e.keyCode==13){
				$('#dealPwdModal .sureBtn').click()
			}
		})
	}

	function refreshFiles(){
		$.post("/ceo/getToCeoFiles", function(res) {
			var fileList = groupByStatus(res);
			var openBtn = '<span class="open-btn"></span>';
			var downBtn = '<button type="button" class="btn btn-link btn-sm load-file">下载</button>';
			var dealBtn = '<button type="button" class="btn btn-sm btn-dealfile">回复</button>';
			var disDealBtn = '<button type="button" class="btn btn-sm btn-dealfile" disabled>回复</button>';
			if(fileList.complete){//完成的
				$('.li-complete>ul').empty()
				$('.li-complete .amount-span').text(fileList.complete.length);
				for(var i=0; i<fileList.complete.length; i++){
					var file = fileList.complete[i];
					var statuslistLen = file.statusList.length;
					file.managerTip = file.statusList[2]? file.statusList[2].managerTip: undefined;
					file.ceoTip = file.statusList[4]?  file.statusList[4].ceoTip: undefined; 
					var fileLi = '<li class="row row-files" id="File-'+ file.id +'" data-time="'+ file.statusList[statuslistLen -1].time +'">';
					fileLi += '<div class="col-sm-2 staff-name">' + file.staff + '</div>';
					fileLi += '<div class="col-sm-3 file-title">' + file.title +'</div>';
					fileLi += '<div class="col-sm-4 file-name">' + file.filename + '</div>';
					fileLi += '<div class="col-sm-2 file-status">@Pass&Not@</div>'
					fileLi +='<div class="col-sm-1 buttons">'+ openBtn +'</div>';
					var managerTip = file.managerTip?file.managerTip:"通过"; 
					switch (file.status){
						case 40:
						case 400:
							fileLi = fileLi.replace(/@Pass&Not@/,"不通过");
							var ceoTip = file.ceoTip? file.ceoTip: "不通过";
							break;
						case 41:
						case 410:
							fileLi = fileLi.replace(/@Pass&Not@/,"通过");
							var ceoTip = file.ceoTip? file.ceoTip: "通过";
							break;
						default:
							break;
					}
					
					var managertips = '<div class="row manager-tip">' +
						'<div class="col-sm-3">'+ file.manager +'的回复：</div>' +
						'<div class="col-sm-7 tip">' + managerTip + '</div>' +
						'<div class="col-sm-2 time">' + file.statusList[2].time + '</div>' +
						'</div>';
					var ceotips = '<div class="row ceo-tip">' +
						'<div class="col-sm-3">我的回复：</div>' +
						'<div class="col-sm-7 tip">' + ceoTip + '</div>' +
						'<div class="col-sm-2 time">' + file.statusList[4].time + '</div>' +
						'</div>';
					fileLi += '<div class="tips-container">'+ managertips + ceotips +'</div>' + '</li>';
					$('.li-complete>ul').append(fileLi);
				}
			}else{
				$('.li-complete>ul').html('<li class="empty">暂无文件</li>');
			}
			
			if(fileList.wait){//待阅
				$('.li-wait>ul').empty();
				$('.li-wait .amount-span').text(fileList.wait.length);
				for(var i=0; i<fileList.wait.length; i++){
					var file = fileList.wait[i];
					var statuslistLen = file.statusList.length;
					var fileLi = '<li class="row row-files" id="File-'+ file.id +'" data-time="'+ file.statusList[statuslistLen -1].time +'">';
					fileLi += '<div class="col-sm-2 staff-name">' + file.staff + '</div>';
					fileLi += '<div class="col-sm-2 file-title">' + file.title + '</div>';
					fileLi += '<div class="col-sm-4 file-name">' + file.filename + '</div>';
					file.managerTip = file.statusList[2]?  file.statusList[2].managerTip: undefined;
					var managerTip = file.managerTip?file.managerTip:"通过"; 
					if(file.status == 21) {
						fileLi += '<div class="col-sm-2 file-status">待阅</div>';
						fileLi +='<div class="col-sm-2 buttons">'+ downBtn + disDealBtn +'</div>';
					}else{//30
						fileLi += '<div class="col-sm-2 file-status">已下载</div>';
						fileLi +='<div class="col-sm-2 buttons">'+ downBtn + dealBtn +'</div>';
					}
					
					var managertips = '<div class="row manager-tip">' +
						'<div class="col-sm-3 manager">'+ file.manager +'的回复：</div>' +
						'<div class="col-sm-7 tip">' + managerTip + '</div>' +
						'<div class="col-sm-2 time">' + file.statusList[2].time + '</div>' +
						'</div>';
					fileLi += managertips + '</li>';
					$('.li-wait>ul').append(fileLi);
				}
			}else{
				$('.li-wait>ul').html('<li class="empty">暂无新文件需要处理</li>');
			}
	
			//点击"下载"Button
			$('.load-file').off('click').on('click', downLoadFile);
	
			$(".btn-dealfile").off('click').on('click', dealFile);
	
			$('.open-btn').off('click').click(function() {
				var $thisLi = $(this).parents('.row-files');
				$thisLi.find('.tips-container').stop().slideToggle('fast');
				$thisLi.siblings().find('.tips-container').stop().slideUp('fast');
			})
		})
	}
	
	function groupByStatus(res){
		var fileList = {};
		res = JSON.parse(res);
		res = sortByTime(res);
		for(var i = 0; i < res.length; i++) {
			var resObj = res[i];
			var statusTime = resObj.statusTime;
			var statusTimeInfo = statusTime[statusTime.length -1];
			var status = Number(statusTimeInfo.status);
			var fileObj = {
				id: resObj.id,
				title:resObj.title,
				filename: resObj.filename,
				staff: resObj.staff,
				status: status,
				manager: resObj.manager,
				statusList: statusTime
			}
			switch (status){
				case 21://经理通过
				case 30://老板下载
					if(!fileList.wait){
						fileList.wait = [];
					}
					fileList.wait.push(fileObj);
					break;
				case 40://老板驳回
				case 41://老板通过
					if(!fileList.complete){
						fileList.complete = [];
					}
					fileList.complete.push(fileObj);
					break;
				default:
					break;
			};
		}
		return fileList;
	}

})