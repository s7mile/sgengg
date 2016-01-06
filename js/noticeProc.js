$(function(){
	$('head').append('<script type="text/javascript" src="../js/addNotice.js"></script>');

	//현재페이지넘버
	var nowNum, key;
	if(getUrlVars(1) > 0) nowNum = getUrlVars(1);
	else nowNum = 1;

	//현재 검색어
	if(getUrlVars(2) !== null){
		key = getUrlVars(2);
		$("#key").val(key);
	}

	//paging
	var paging = {
		init: function() {
			this.func();
		},
		func: function() {
			$.ajax({	
				url:'/countNoticeWeb',
				type:'GET',
				data:{},
				success:function(result){
					var totalNum = Math.ceil(result[0].count/10);
					// console.log(nowNum);

					for(var i=1; i<=totalNum; i++){
						if(i == nowNum)
							$(".paging ol").append("<li><a href='notice.html?num="+i+"' class='sel'>"+i+"</a></li>");
						else
							$(".paging ol").append("<li><a href='notice.html?num="+i+"'>"+i+"</a></li>");
					}
				}
			});
		}
	}

	//notice
	var listNotice = {
		init: function() {
			this.func();
		},
		func: function() {
			$.ajax({
				url:'/listNoticeWeb',
				type:'GET',
				data:{pageNumber: nowNum},
				success:function(result){
					console.log(result);
					paging.init();
					for(var i=0; i<result.length; i++){	
						var date = result[i].signup_date.split("T");
						$("ul.notice").append("<li><a href='notice_view.html?no="+result[i].schedule_idx+"' class='list'><h3>" + result[i].title + "</h3><p class='cont'>" + result[i].contents + "</p><p>" + date[0] + "</p></a><a href='javascript:;' class='deleteNotice' data-no='"+result[i].schedule_idx+"'>X</a></li>");
					}

					//deleteNotice
					$(".deleteNotice").on("click", function(){
						var idx = $(this).data("no");
						$.ajax({
							url:'/deleteNoticeWeb',
							type:'GET',
							data:{scheduleIndex: idx},
							success:function(result){
								// console.log(result);
								if(result == 1)
									location.reload();
								else
									alert("오류!");
							}
						});
					});
				}
			});	
		}
	}

	//검색의 paging
	var searchPaging = {
		init: function() {
			this.func();
		},
		func: function() {
			$.ajax({	
				url:'/countSearchWeb',
				type:'GET',
				data:{text: key},
				success:function(result){
					var totalNum = Math.ceil(result[0].count/10);
					// console.log(nowNum);

					for(var i=1; i<=totalNum; i++){
						if(i == nowNum)
							$(".paging ol").append("<li><a href='notice.html?num="+i+"&key="+key+"' class='sel'>"+i+"</a></li>");
						else
							$(".paging ol").append("<li><a href='notice.html?num="+i+"&key="+key+"'>"+i+"</a></li>");
					}
				}
			});
		}
	}

	var searchList = {
		init: function() {
			this.func();
		},
		func: function() {
			if(key.length > 0){
				$.ajax({	
					url:'/searchNoticeWeb',
					type:'GET',
					data:{
						pageNumber: nowNum,
						text: key
					},
					success:function(result){
						console.log(result);
						searchPaging.init();
						for(var i=0; i<result.length; i++){	
							var date = result[i].signup_date.split("T");
							$("ul.notice").append("<li><a href='#'><h3>" + result[i].title + "</h3><p>" + result[i].contents + "</p><p>" + date[0] + "</p></a><a href='javascript:;' class='deleteNotice' data-no='"+result[i].schedule_idx+"'>X</a></li>");
						}

						//deleteNotice
						$(".deleteNotice").on("click", function(){
							var idx = $(this).data("no");
							$.ajax({
								url:'/deleteNoticeWeb',
								type:'GET',
								data:{scheduleIndex: idx},
								success:function(result){
									console.log(result);
									if(result == 1)
										location.reload();
									else
										alert("오류!");
								}
							});
						});
					}
				});	
			}
		}
	}

	//검색버튼
	var searchBtn = {
		init: function() {
			this.func();
		},
		func: function() {
			$("#searchBtn").on("click", function(){
				var thisKey = $("#key").val();
				if(thisKey.length > 1)
					location.href = "/page/notice.html?num="+ 1 +"&key=" + thisKey;
				else{
					alert("검색어를 2자 이상 입력해주세요");
					$("#key").focus();
				}
			});
		}
	}
	searchBtn.init();


	if(key == undefined)
		listNotice.init();
	else
		searchList.init();
});