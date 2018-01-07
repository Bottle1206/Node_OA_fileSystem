$('.row-user > ul').perfectScrollbar();

$('.navbar .operate-li').click(function(){
	$(this).find('span').toggleClass('rotate-over');
	$(this).find('ul').slideToggle('fast');
});

$('#logOut').click(function(){
	reConfirm('离开提示','确认退出当前账户？',function(r){
		if(r){
			window.location.href = '/login';
		}
	})
});

$('#changePwd').click(() => {
	window.location.href = '/changepwd';
})

function findWeather() {
	var cityUrl = 'http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js';
	$.getScript(cityUrl, function(script, textStatus, jqXHR) {
		var citytq = remote_ip_info.city; // 获取城市
		var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&city=" + citytq + "&day=0&dfc=3";
		$.ajax({
			url: url,
			dataType: "script",
			scriptCharset: "gbk",
			success: function(data) {
				var _w = window.SWther.w[citytq][0];
				var _f = _w.f1 + "_0.png";
				if(new Date().getHours() > 17) {
					_f = _w.f2 + "_1.png";
				}
				var img = "<img width='16px' height='16px' src='http://i2.sinaimg.cn/dy/main/weather/weatherplugin/wthIco/20_20/" + _f +
					"' />";
				var tq = citytq + " " + img + " " + _w.s1 + " " + _w.t1 + "℃～" + _w.t2 + "℃ " + _w.d1 + _w.p1 + "级";

				$('#weather').html(tq);
				$('.kindly-reminder').find('.show-date').text(getNowTime().split(' ')[0])
				$('.kindly-reminder').show().addClass('weather-show');
				setTimeout(() => {
					$('.kindly-reminder').removeClass('weather-show').css({'opacity':1,'top':'1px'});
					$('.kindly-reminder').animate({'top':'-68px','opacity':0.2},500);
				},4000)
			}
		});
	});
}

function sortByTime(res){//从大到小
	var n = res.length;
	for(let i=0; i<n; i++){
		var statusTime = JSON.parse(res[i].statusTime);
		res[i].statusTime = statusTime;
		var time = statusTime[statusTime.length -1].time;
		time = Number(time.replace(/\D/g,''));
		res[i].time = time;
	}
	for(let j=0; j<n-1; j++){	
		for(let k=0; k<n-j-1; k++){
			if(res[k].time < res[k+1].time){
				var tmp = res[k];
				res[k] = res[k+1];
				res[k+1] = tmp;
			}
		}
	}
	return res;
}

function getNowTime(){
	function addZero(n){
		if(n<10){
			n = "0"+n;
		}
		return n;
	}
	var time = new Date();
	var month = time.getMonth()+1;
	var now = time.getFullYear() +'-'+ 
	          addZero(month) +'-'+ 
	          addZero(time.getDate()) +' '+ 
	          addZero(time.getHours()) +':'+ 
	          addZero(time.getMinutes());
	return now;
}


function reConfirm(title, content, callback){
	$('#confirmModal .modal-title').text(title); 
	$('#confirmModal .modal-body p').text(content); 
	$('#confirmModal').addClass('in').show();
	$('#confirmModal').prepend('<div class="modal-backdrop fade in"></div>');
	$('#confirmModal .cancelBtn , #confirmModal .close-btn').off('click').click(function(){
		$('#confirmModal').removeClass('in').hide().find('.modal-backdrop').remove();
		callback(false);
	});
	$('#confirmModal .sureBtn').off('click').click(function(){
		$('#confirmModal').removeClass('in').hide().find('.modal-backdrop').remove();
		callback(true);
	});
}

function reAlert(title,content){
	$('#alertModal .modal-title').text(title); 
	$('#alertModal .modal-body p').text(content); 
	$('#alertModal').addClass('in').show();
	$('#alertModal').prepend('<div class="modal-backdrop fade in"></div>');
	$('#alertModal .sureBtn, #alertModal .close-btn').off('click').click(function(){
		$('#alertModal').removeClass('in').hide().find('.modal-backdrop').remove();
	});
}

function showTime(){
	var time = getNowTime();
	$('.showtime-li .show-date').text(time.split(' ')[0]);
	$('.showtime-li .show-time').text(time.split(' ')[1]);
}

function addDate(days) {
	var d = new Date();
	d.setDate(d.getDate() - days);
	var month = d.getMonth() + 1;
	var day = d.getDate();
	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	var val = d.getFullYear() + "" + month + "" + day;
	return Number(val);
}

showTime();

setInterval(showTime,10000);

findWeather();

//
$('.date-filter').change(function(){
//	console.log($(this).val());
	switch (Number($(this).val())){
		case 0://所有
			break;
		case 1://三天
			var addTime = addDate(3);
			break;
		case 2://一周
			var addTime = addDate(7);
			break;
		case 3://一个月
			var addTime = addDate(30);
			break;
		default:
			break;
	}
	var amount = 0;
	var $ul = $(this).parents('.row-user').children('ul');
	$ul.find('.empty').remove();
	var $lis = $ul.children('li');
	if(addTime){	
		for(var i=0; i<$lis.length; i++){
			var time = $lis.eq(i).attr('data-time').split(' ')[0];
			time = Number(time.replace(/\-/g,''));
			if(time>addTime){
				$lis.eq(i).show();
				amount++;
			}else{
				$lis.eq(i).hide();
			}
		}
	}else{
		$lis.show();
		amount = $lis.length;
	}
	if(amount == 0){
		$ul.prepend('<li class="empty">暂无文件</li>');
	}
	$(this).next().text(amount)
	
})




