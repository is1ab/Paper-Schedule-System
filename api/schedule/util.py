from datetime import datetime, timedelta

from store.db.model.user import User, anonymousUser
from store.db.model.schedule import Schedule, ScheduleStatus
from store.db.model.holiday import Holiday
from store.db.model.host_rule import HostRule, HostRuleOrder, HostRuleSwapRecord


def generate_schedule(
    arranged_schedules: list[Schedule],
    holidays: list[Holiday],
) -> list[Schedule]:
    results: list[Schedule] = []
    holiday_dates: list[str] = _generate_holiday_dates(holidays)

    for holiday in holidays:
        results.append(holiday.to_schedule())

    for arranged_schedule in arranged_schedules:
        if arranged_schedule.status.id == 1:
            results.append(arranged_schedule)
            continue
        if arranged_schedule.schedule_datetime == None:
            continue
        schedule_date: str = arranged_schedule.schedule_datetime.strftime("%Y-%m-%d")
        if schedule_date in holiday_dates:
            continue
        results.append(arranged_schedule)

    return results


def generate_host_rule_pending_schedules(
    host_rule: HostRule,
    host_rule_orders: list[User],
    arranged_host_rule_schedules: list[Schedule],
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
        schedule_date += (-1 if weekday > host_rule.weekday else 1) * timedelta(
            days=weekday - host_rule.weekday
        )

    while schedule_date <= end_date:
        date: str = schedule_date.strftime("%Y-%m-%d")
        if date in holiday_dates:
            schedule_date += timedelta(weeks=1)
            continue
        user: User = host_rule_orders[host_index % len(host_rule_orders)]
        iteration: int = host_index // len(host_rule_orders)

        # Check schedule is arranged
        arragned_schedule: Schedule | None = _find_schedule_arragned(
            arranged_host_rule_schedules, host_rule.id, user.account, iteration
        )
        if arragned_schedule != None:
            arragned_schedule.schedule_datetime = schedule_date
            host_rule_schedules.append(arragned_schedule)
            host_index += 1
            schedule_date += timedelta(weeks=host_rule.period)
            continue

        # Add pending schedule if schedule is not arranged
        host_rule_schedules.append(
            Schedule(
                name="" if host_rule.rule == "SCHEDULE" else host_rule.name,
                link="",
                description="",
                status=ScheduleStatus(4, "等待規劃中")
                if host_rule.rule == "SCHEDULE"
                else ScheduleStatus(2, "已完成"),
                user=user if host_rule.rule == "SCHEDULE" else None,
                attachments=[],
                host_rule=host_rule,
                host_rule_iterator=iteration,
                schedule_datetime=schedule_date,
            )
        )

        host_index += 1
        schedule_date += timedelta(weeks=host_rule.period)

    return host_rule_schedules


def swap_schedule(schedules: list[Schedule], host_rule_swap_records: list[HostRuleSwapRecord]):
    for record in host_rule_swap_records:
        specific_schedule = _find_schedule_arragned(schedules, record.host_rule_id, record.specific_user_account, record.specific_iteration)
        swap_schedule = _find_schedule_arragned(schedules, record.host_rule_id, record.swap_user_account, record.swap_iteration)
        specific_schedule_index = schedules.index(specific_schedule)
        swap_schedule_index = schedules.index(swap_schedule)
        schedules[swap_schedule_index].schedule_datetime, schedules[specific_schedule_index].schedule_datetime = schedules[specific_schedule_index].schedule_datetime, schedules[swap_schedule_index].schedule_datetime
    return schedules    


def _generate_holiday_dates(holidays: list[Holiday]):
    return [holiday.date.strftime("%Y-%m-%d") for holiday in holidays]


def _find_schedule_arragned(
    arranged_host_rule_schedules: list[Schedule],
    host_rule_id: int,
    account: str,
    iteration: int,
) -> Schedule | None:
    for arranged_host_rule_schedule in arranged_host_rule_schedules:
        if (
            arranged_host_rule_schedule.host_rule != None
            and arranged_host_rule_schedule.host_rule.id == host_rule_id
            and arranged_host_rule_schedule.host_rule_iterator == iteration
            and arranged_host_rule_schedule.user.account == account
        ):
            return arranged_host_rule_schedule
    return None