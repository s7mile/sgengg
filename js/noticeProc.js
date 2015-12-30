$(function(){
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
					// console.log(result);
					paging.init();
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

	var noticeProc = {
		init: function() {
			this.func();
		},
		func: function() {
			$("#noticeRegit").on("click", function(){
				var subject = $("#subject").val(),
					place = $("#place").val(),
					participant = $("#participant").val(),
					startdate = $("#startDate").val() + " " + $("#startHour option:selected").val() + ":" + $("#startMinute option:selected").val() + ":00",
					enddate = $("#endDate").val() + " " + $("#endHour option:selected").val() + ":" + $("#endMinute option:selected").val() + ":00",
					content = $("#content").val(),
					voteSetting = $("#voteSetting").val(),
					voteTitle = $("#voteSubject").val(),
					deadDate = $("#deadDate").val() + " " + $("#deadHour option:selected").val() + ":" + $("#deadMinute option:selected").val() + ":00",
					planOn;
				if($("#startDate").val().length > 0) planOn = 1;
				else planOn = 0;

				$.ajax({
					url:'/createNotice',
					type:'GET',
					data:{
						noticeTitle: subject,
						contents: content, 
						startDate: startdate, 
						endDate: enddate,
						target: participant,
						place: place,
						voteOn: voteSetting,
						planOn: planOn,
						voteEndDate: deadDate,
						voteTitle: voteTitle
					},
					success:function(result){
						// console.log(result);

						var type;
						if($(".voteSelList .voteSel:first-child").text() == '참석') type=1;
						else type=0;
						$('.voteSelList .voteSel').each(function(index) {
							var name = $(this).find("span").text();
							$.ajax({
								url:'/createVoteWeb',
								type:'GET',
								data:{
									type: type,
									name: name,
									scheduleIndex: result[0].schedule_idx,
									code: index
									},
								success:function(result){
									// console.log(result);
									if(result == 1)
										location.reload();
									else
										alert("오류!");
								}
							});
						});


						// location.reload();
					}
				});
			});
		}
	}
	noticeProc.init();

	//시, 분
	var time = {
		init: function() {
			this.func();
		},
		func: function() {
			for(var i=0; i<24; i++){
				if(i<10) var str = "0"+i;
				else var str = i;
				$("#startHour").append("<option value='"+str+"'>"+str+"</option>");
				$("#endHour").append("<option value='"+str+"'>"+str+"</option>");
				$("#deadHour").append("<option value='"+str+"'>"+str+"</option>");
			}
			for(var i=0; i<=60; i++){
				if(i<10) var str = "0"+i;
				else var str = i;
				$("#startMinute").append("<option value='"+str+"'>"+str+"</option>");
				$("#endMinute").append("<option value='"+str+"'>"+str+"</option>");
				$("#deadMinute").append("<option value='"+str+"'>"+str+"</option>");
			}
		}
	}
	time.init();

	//투표 항목 삭제
	var voteSelDelete = {
		init: function() {
			this.func();
		},
		func: function() {
			$(".voteSel a").on("click", function(){
				$(this).parent().remove();
			});
		}
	}
	voteSelDelete.init();

	//투표 항목 추가
	var voteSelAdd = {
		init: function() {
			this.func();
		},
		func: function() {
			$(".voteSelAdd").on("click", function(){
				$(".voteSelList").append('<div class="voteSel">' + $("#voteAdd").val() + '<a href="javascript:;">X</a></div>');
				$("#voteAdd").val("");

				voteSelDelete.init();
			});

		}
	}
	voteSelAdd.init();


	if(key == undefined)
		listNotice.init();
	else
		searchList.init();
});