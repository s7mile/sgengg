$(function(){	
	var calendar = new controller();
	calendar.init();

	function controller(target) {
		var that = this;  
		var m_oMonth = new Date();
		var todayDate = m_oMonth.getDate();
		m_oMonth.setDate(1);

		this.init = function() {
			that.renderCalendar();
			that.initEvent();
		}

		/* 달력 UI 생성 */
		this.renderCalendar = function() {
			var arrTable = [];

			arrTable.push('<table cellpadding="0" cellspacing="0"><colgroup>');
			for(var i=0; i<7; i++) {
				arrTable.push('<col width="100">');
			}         
			arrTable.push('</colgroup><thead><tr>');

			var arrWeek = "일월화수목금토".split("");

			for(var i=0, len=arrWeek.length; i<len; i++) {
					var sClass = '';
				arrTable.push('<td>' + arrWeek[i] + '요일</td>');
			}
			arrTable.push('</tr></thead>');
			arrTable.push('<tbody>');

			var oStartDt = new Date(m_oMonth.getTime());
		// 1일에서 1일의 요일을 빼면 그 주 첫번째 날이 나온다.
			oStartDt.setDate(oStartDt.getDate() - oStartDt.getDay());

			for(var i=0; i<100; i++) {
				if(i % 7 == 0) {
					arrTable.push('<tr>');
				}

				var sClass = 'dateCell '
				sClass += m_oMonth.getMonth() != oStartDt.getMonth() ? 'notThisMonth ' : '';
				sClass += todayDate ==  oStartDt.getDate()? 'today'	 : '';

				arrTable.push('<td class="'+sClass+'">' + oStartDt.getDate() + '</td>');
				oStartDt.setDate(oStartDt.getDate() + 1);

				if(i % 7 == 6) {
					arrTable.push('</tr>');
					if(m_oMonth.getMonth() != oStartDt.getMonth()) {
						 break;
					}
				}
			}
			arrTable.push('</tbody></table>');

			$('#calendar').html(arrTable.join(""));

			that.changeMonth();
		 }

		/* Next, Prev 버튼 이벤트 */
		this.initEvent = function() {
			$('#btnPrev').click(that.onPrevCalendar);
			$('#btnNext').click(that.onNextCalendar);
		}

		/* 이전 달력 */
		this.onPrevCalendar = function() {
			m_oMonth.setMonth(m_oMonth.getMonth() - 1);
			that.renderCalendar();
		}

		/* 다음 달력 */
		this.onNextCalendar = function() {
			m_oMonth.setMonth(m_oMonth.getMonth() + 1);
			that.renderCalendar();
		}

		/* 달력 이동되면 상단에 현재 년 월 다시 표시 */
		this.changeMonth = function() {
			$('#currentDate').text(that.getYearMonth(m_oMonth).substr(0,9));
		}

		/* 날짜 객체를 년 월 문자 형식으로 변환 */
		this.getYearMonth = function(oDate) {
			return oDate.getFullYear() + '년 ' + (oDate.getMonth() + 1) + '월';
		}
	}

	//thisMonthList
	// var thisMonthList = {
	// 	init: function() {
	// 		this.func();
	// 	},
	// 	func: function() {
	// 		$.ajax({
	// 			url:'/calendarWeb',
	// 			type:'GET',
	// 			data:{
	// 				year: year,
	// 				month: month
	// 			},
	// 			success:function(result){
	// 				console.log(result);
	// 			}
	// 		});	
	// 	}
	// }
	// thisMonthList.init();

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
						if($(".voteSelList .voteSel:first-child").text() == '참석') type=0;
						else type=1;
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
					}
				});
			});
		}
	}
	noticeProc.init();

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
				$(".voteSelList").append('<div class="voteSel"><span>' + $("#voteAdd").val() + '</span><a href="javascript:;">X</a></div>');
				$("#voteAdd").val("");

				voteSelDelete.init();
				noticeProc.init();
			});

		}
	}
	voteSelAdd.init();
});