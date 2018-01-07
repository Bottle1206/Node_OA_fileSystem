var MANAGER = getUserName();
$('.ico-rank').addClass('ico-manager');
$('.rank-name').text('部门主管 ');

$(function() {
	refreshFiles();
	
	//经理回复：同意
	$('#Pass').on('click',function(){
		respondFile(true);
	});
	//经理回复：不通过
	$('#NoPass').on('click',function(){
		respondFile(false);
	});	
	
	//下载文件
	function downLoadFile(){
		var $this = $(this);
		var $thisParent = $this.parent();
		var fileId = $thisParent.parent().attr('id').split('-')[1];
		var filename = $thisParent.siblings('.file-name').text();
		var staff = $thisParent.siblings('.staff-name').text();
		var $time_status = $thisParent.siblings('.file-time');
		var statusStr = $.trim($time_status.text().split('/')[1]);
		if(statusStr == "待下载"){
			var newState = {
				id: fileId,
				status: 1
			}
			$.post('/setStatusTime',newState,function(res){//newState===obj{id,status,[managertip,[ceotip]]}
				if(res == "setStatusTime_success"){
					window.location.href = "/avatar/" + staff + "/" + filename;
					setTimeout(function(){
						var newText = $time_status.text().replace(/[\u4e00-\u9fa5]{1,}/,'待阅');
						$time_status.text(newText);
						$this.siblings('.deal-file').removeAttr('disabled');
					},1000);
				}else{
					console.error("下载失败！");
				}
			})
		}else{
			window.location.href = "/avatar/" + staff + "/" + filename;
		}
	}
	
	//点击“回复”btn初始化
	function dealFile(){
		var targetId = $(this).parents('.row-files').attr('id').split('-')[1];
		var $thisParent = $(this).parent();
		$('#dealFileModal .modal-title').text($thisParent.siblings('.staff-name').text());
		$('#dealFileModal .file-title').text($thisParent.siblings('.file-title').text());
		$('#dealFileModal .file-name').text($thisParent.siblings('.file-name').text());
		$('#dealFileModal').data('targetId', targetId);
		$('#suggest').val('');
		$('#dealFileModal').modal('show');
	}
	
	//回复（不通过/同意）
	function respondFile(flag){
		var id = Number($('#dealFileModal').data('targetId'));
		if(flag){//通过
			var StatusVal = 21;
		}else{//不通过
			var StatusVal = 20;
		}
		var newState = {
			id: id,
			status: StatusVal,
			managerTip: $('#suggest').val()
		}
		$.post('/setStatusTime',newState,function(res){//newState===obj{id,status,[managertip,[ceotip]]}
			if(res == "setStatusTime_success"){
				if(flag){
					$.post('/manager/setStatusFlag',{
						status:21,
						id:id
					},function(res){
						console.log(res);
					})
				}
				refreshFiles();
				$('#dealFileModal').modal('hide');
			}else{
				console.error("发生未知错误，请重试！");
			}
		});
	}
	
	//请求所有数据，//刷新列表
	function refreshFiles(){
		$.post('/manager/getToManagerFiles',{manager: MANAGER}, function(res) {
			var fileList = groupByStatus(res);
			//dom处理
			var openBtn = '<span class="open-btn"></span>';
			var downBtn = '<button type="button" class="btn btn-link load-file">下载</button>';
			var disDealBtn = '<button type="button" class="btn btn-success btn-sm deal-file" disabled>回复</button>';
			var dealBtn = '<button type="button" class="btn btn-success btn-sm deal-file">回复</button>';
			
			if(fileList.complete){
				$('.li-complete>ul').empty();
				$('.li-complete .amount-span').text(fileList.complete.length);
				for(var i=0; i<fileList.complete.length; i++){
					var file = fileList.complete[i];
					var status = file.status;
					var statuslistLen = file.statusList.length;
					file.managerTip = file.statusList[2]? file.statusList[2].managerTip: undefined;
					file.ceoTip = file.statusList[4]? file.statusList[4].ceoTip: undefined;
					var fileLi = '<li class="row row-files" id="File-'+ file.id +'" data-time="'+ file.statusList[statuslistLen -1].time+'">';
					fileLi += '<div class="col-sm-2 staff-name">' + file.staff + '</div>';
					fileLi += '<div class="col-sm-3 file-title">'+ file.title +'</div>';
					fileLi += '<div class="col-sm-4 file-name">' + file.filename + '</div>';
					fileLi += '<div class="col-sm-2 file-status">@Pass&Not@</div>'
					fileLi +='<div class="col-sm-1 col-xs-1 buttons">'+ openBtn +'</div>';
					switch (status){
						case 20:
							fileLi = fileLi.replace(/@Pass&Not@/,"不通过");
							var managerTip = file.managerTip? file.managerTip: "不通过";
							break;
						case 21:
						case 30:
							fileLi = fileLi.replace(/@Pass&Not@/,"通过");
							var managerTip = file.managerTip? file.managerTip: "通过";
							break;
						case 41:
							fileLi = fileLi.replace(/@Pass&Not@/,"被主管领导通过");
							var managerTip = file.managerTip? file.managerTip: "通过";
							var ceoTip = file.ceoTip? file.ceoTip : "通过"; 
							//待定
							break;
						case 40:
							fileLi = fileLi.replace(/@Pass&Not@/,"被主管领导驳回");
							var managerTip = file.managerTip? file.managerTip: "通过";
							var ceoTip = file.ceoTip? file.ceoTip : "不通过";
							//待定
							break;
						default:
							break;
					}
					var managertips = '<div class="row manager-tip">' +
						'<div class="col-sm-2">我的回复：</div>' +
						'<div class="col-sm-8 tip">' + managerTip + '</div>' +
						'<div class="col-sm-2 time">' + file.statusList[2].time + '</div>'+
						'</div>';
					if(status == 41 || status == 40){
						var ceotips = '<div class="row ceo-tip">' +
							'<div class="col-sm-2">主管领导的回复：</div>' +
							'<div class="col-sm-8 tip">' + ceoTip + '</div>' +
							'<div class="col-sm-2 time">' + file.statusList[4].time + '</div>'+
							'</div>';
						if(file.sign_status != 50){//50标示已读
							fileLi =  fileLi.replace(/row-files/,'row-files red-dot');
						}
						fileLi += '<div class="tips-container">'+ managertips + ceotips +'</div></li>';	
					}else{
						fileLi += '<div class="tips-container">'+ managertips +'</div></li>';
					}
					$(fileLi).appendTo('.li-complete>ul');
				}
			}else{
				$('.li-complete>ul').html('<li class="empty">暂无文件</li>');
			}
			
			if(fileList.wait){
				$('.li-wait>ul').empty();
				$('.li-wait .amount-span').text(fileList.wait.length);
				for(var i=0; i<fileList.wait.length; i++){
					var file = fileList.wait[i];
					var fileLi = '<li class="row row-files" id="File-'+ file.id +'" data-time="'+ file.statusList[0].time +'"><div class="col-sm-2 col-xs-2 staff-name">' + file.staff + '</div>';
					fileLi += '<div class="col-sm-2 file-title">'+ file.title +'</div>';
					fileLi += '<div class="col-sm-4 file-name">' + file.filename + '</div>';
					fileLi += '<div class="col-sm-2 file-time">' + file.statusList[0].time + ' / @Pass&Not@</div>';
					if(file.status == 0){
						fileLi = fileLi.replace(/@Pass&Not@/,"待下载");//不能点
						fileLi +='<div class="col-sm-2 buttons">'+ downBtn+ disDealBtn +'</div>';
					}else{
						fileLi = fileLi.replace(/@Pass&Not@/,"待阅");//可以下载
						fileLi +='<div class="col-sm-2 buttons">'+ downBtn+ dealBtn +'</div>';
					}
					fileLi +=  '</li>';
					$('.li-wait>ul').append(fileLi);
				}
			}else{
				$('.li-wait>ul').html('<li class="empty">暂无新文件需要处理</li>');
			}
			
			//点击"下载"Button
			$('.load-file').off('click').on('click', downLoadFile);
			//点击“回复”Button
			$(".deal-file").off('click').on('click', dealFile);
			//点击“详情”ico展开
			$('.open-btn').off('click').click(function(){
				var $thisLi = $(this).parents('.row-files');
				var id = Number( $thisLi.attr('id').split('-')[1] );
				$thisLi.find('.tips-container').stop().slideToggle('fast');
				$thisLi.siblings().find('.tips-container').stop().slideUp('fast');
				if($thisLi.hasClass('red-dot')){
					$.post('/manager/setStatusFlag',{
						status:50,
						id:id
					},function(res){
						$thisLi.removeClass('red-dot')
					})
				}
			});
			
		});
	}
	
	//给所有数据按状态分组
	function groupByStatus(res){
		var fileList = {};
		res = $.parseJSON(res);
		res = sortByTime(res);
		for(var i = 0; i < res.length; i++) {
			var resObj = res[i];
			var statusTime = resObj.statusTime;
			var statusTimeInfo = statusTime[statusTime.length - 1];
			var status = Number(statusTimeInfo.status);
			var fileObj = {
				id: resObj.id,
				title:resObj.title,
				staff: resObj.staff,
				sign_status: Number(resObj.status),
				status: status,
				filename: resObj.filename,
				statusList: statusTime
			}
			switch (status){
				case 0:
				case 1:
					if(!fileList.wait){
						fileList.wait = [];
					};
					fileList.wait.push(fileObj);
					break;
				case 20:
				case 21:
				case 30:
				case 40:
				case 41:
					if(!fileList.complete){
						fileList.complete = [];
					};
//					if(status == 40 || status == 41){
//						fileList.complete.unshift(fileObj);
//					}else{
						fileList.complete.push(fileObj);
//					}
					break;
				default:
					break;
			}
		}
		return fileList;
	}
	
})