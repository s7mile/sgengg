$(function(){
	//proc 중복체크위한 변수
	var chk=0;

	var noticeProc = {
		init: function() {
			this.func();
		},
		func: function() {
			$("#noticeRegit").on("click", function(){
				if(chk == 0){
					chk++;

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
							
							$('.voteSelList .voteSel').each(function(index) {
								if(($(this).find("span").text() == '참석') || ($(this).find("span").text() == '불참석')){
									type=0;
								}else{
									type=1;
								}
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
							chk = 0;
						}
					});//ajax
				}//if
			});//click event
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
				if($("#voteAdd").val().length == 0){
					alert("선택항목을 작성해주세요");
					$("#voteAdd").focus();
				}else{
					$(".voteSelList").append('<div class="voteSel"><span>' + $("#voteAdd").val() + '</span><a href="javascript:;">X</a></div>');
					$("#voteAdd").val("");

					voteSelDelete.init();
					noticeProc.init();
				}
			});

		}
	}
	voteSelAdd.init();
});