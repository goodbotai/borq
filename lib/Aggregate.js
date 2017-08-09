/**
 * Takes a conversation and extracts:
 * - facebook messenger id
 * - a conversation metadata object that has metadata and the conversation
 * @param {object} conversation questions, responses and metadata.
 * @return {object} messenger id and submission metadata from the conversation.
 */
function aggregate(conversation) {
  const {startTime, lastActive, responses, context} = conversation;
  const metadata = {
    start: startTime,
    stop: lastActive,
    bot_identifier: context,
    responses,
    conversation,
  };

  return {
    userId: context.user,
    submission_metadata: metadata,
  };
}

module.exports = aggregate;
