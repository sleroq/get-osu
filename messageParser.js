const moment = require("moment");

function user(user) {
  // console.log(user);
  let is_online = user.is_online ? "online" : getLastSeen(user.last_visit),
    play_time =
      user.statistics.play_time / 3600 >= 1
        ? Math.round(user.statistics.play_time / 3600) + "</i> <code>hours"
        : Math.round(user.statistics.play_time / 60) + "</i> <code>minutes",
    interests = user.interests
      ? "\n<code>Interests</code>: <i>" + user.interests + "</i>\n"
      : "",
    replays =
      user.statistics.replays_watched_by_others > 0
        ? "<code>replays views</code>: " +
          user.statistics.replays_watched_by_others +
          "\n"
        : "";

  const message =
    `<a href="${user.avatar_url}"> </a><b><a href="https://osu.ppy.sh/users/${
      user.id
    }">${user.username}</a></b>  <code>(${is_online})</code>  #${
      user.statistics.rank.global
    } ${getSupporterHeart(user)}\n` +
    `<i>${play_time} since </code><i>${moment(
      user.join_date,
      moment.ISO_8601
    ).format("L")}</i>\n\n` +
    `<code>pp</code>: <b>${user.statistics.pp}pp</b>\n` +
    `<code>ac</code>: <b>${user.statistics.hit_accuracy}ac</b>\n` +
    `<code>lvl</code>: ${user.statistics.level.current}  (${user.statistics.level.progress}%)\n` +
    `<code>total score</code>: ${user.statistics.total_score}\n` +
    `<code>total hits</code>: ${user.statistics.total_hits}\n` +
    `<code>max combo</code>: ${user.statistics.maximum_combo}\n` +
    `${replays}` +
    getGradeCounts(user.statistics.grade_counts) +
    `<b>${
      user.monthly_playcounts[user.monthly_playcounts.length - 1].count
    }</b> <code>plays this mounth</code>\n` +
    `${interests}`;
  console.log(message);
  return message;
}
function getLastSeen(last_visit) {
  let last = moment(last_visit, moment.ISO_8601),
    now = moment();
  if (now.diff(last, "years") > 1) {
    return +now.diff(last, "years") + " years ago";
  } else if (now.diff(last, "month") > 12) {
    return now.diff(last, "days") + " months ago";
  } else if (now.diff(last, "hours") > 24) {
    return now.diff(last, "days") + " days ago";
  } else if (now.diff(last, "minutes") > 59) {
    return now.diff(last, "hours") + " hours ago";
  } else {
    return now.diff(last, "minutes") + " minutes ago";
  }
}
function getSupporterHeart(user) {
  if (user.is_supporter) {
    switch (user.support_level) {
      case 1:
        return "♥️";
      case 2:
        return "♥️♥️";
      case 3:
        return "♥️♥️♥️";
    }
  } else {
    return "";
  }
}
function getGradeCounts(grade_counts) {
  let text = "";
  if (grade_counts.ss > 0) {
    text += "<code>SS</code>: " + grade_counts.ss + "   ";
  }
  if (grade_counts.ssh > 0) {
    text += "<code>SS(mods)</code>: " + grade_counts.ssh + "    ";
  }
  if (grade_counts.s > 0) {
    text += "<code>S</code>: " + grade_counts.s + "   ";
  }
  if (grade_counts.sh > 0) {
    text += "<code>S(mods)</code>: " + grade_counts.sh + "   ";
  }
  if (grade_counts.a > 0) {
    text += "<code>A</code>: " + grade_counts.a;
  }
  return text + "\n";
}
module.exports = {
  user,
};
