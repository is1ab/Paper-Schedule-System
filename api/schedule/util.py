from datetime import datetime, timedelta

from store.db.model.user import User, anonymousUser
from store.db.model.schedule import Schedule, ScheduleStatus
from store.db.model.holiday import Holiday
from store.db.model.host_rule import HostRule, HostRuleOrder

def generate_schedule(
    arranged_schedules: list[Schedule],
    holidays: list[Holiday],
) -> list[Schedule]:
    results: list[Schedule] = []
    holiday_dates: list[str] = _generate_holiday_dates(holidays)
    
    for holiday in holidays:
        results.append(holiday.to_schedule())

    for arranged_schedule in arranged_schedules:
        if(arranged_schedule.status.id == 1):
            continue
        schedule_date: str = arranged_schedule.schedule_datetime.strftime("%Y-%m-%d")
        if(schedule_date in holiday_dates):
            continue
        results.append(arranged_schedule)

    return results

def generate_host_rule_pending_schedules(
    host_rule: HostRule, 
    host_rule_orders: list[User],
    holidays: list[Holiday],
):
    holiday_dates: list[str] = _generate_holiday_dates(holidays)
    host_rule_schedules: list[Schedule] = []
    start_date: datetime = host_rule.startDate
    end_date: datetime = host_rule.endDate
    weekday: int = start_date.weekday() + 1
    schedule_date: datetime = start_date
    host_index: int = 0

    if host_rule.weekday != weekday:
        schedule_date += timedelta(days=weekday - host_rule.weekday)
    
    while schedule_date <= end_date:
        date: str = schedule_date.strftime("%Y-%m-%d")
        if date in holiday_dates:
            continue
        user: User = host_rule_orders[host_index % len(host_rule_orders)]
        host_rule_schedules.append(Schedule(
            name="",
            link="",
            description="",
            status=ScheduleStatus(1, "等待審核中"),
            user=user,
            attachments=[],
            host_rule=host_rule,
            host_rule_iterator=(host_index // len(host_rule_orders)),
            schedule_datetime=schedule_date
        ))
        host_index += 1
        schedule_date += timedelta(weeks=1)

    return host_rule_schedules

def _generate_holiday_dates(holidays: list[Holiday]):
    return [holiday.date.strftime("%Y-%m-%d") for holiday in holidays]