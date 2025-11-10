import React from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const UpdateLogsModal = ({ event, viewTimezone, onClose }) => {
  const formatTimestamp = (timestamp, tz) => {
    return dayjs(timestamp).tz(tz).format('MMM D, YYYY hh:mm A');
  };

  const formatDateTime = (dateTime, tz) => {
    return dayjs(dateTime).tz(tz).format('MMM D, YYYY hh:mm A');
  };

  const renderChangeValue = (change, tz) => {
    if (change.from && change.to) {
      // check if it's a datetime change
      if (typeof change.from === 'string' && change.from.includes('T')) {
        return (
          <>
            <div>From: {formatDateTime(change.from, tz)}</div>
            <div>To: {formatDateTime(change.to, tz)}</div>
          </>
        );
      }
      // for other changes like timezone
      return (
        <>
          <div>From: {change.from}</div>
          <div>To: {change.to}</div>
        </>
      );
    }
    return null;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Event Update History</h3>
          <button className="btn-close" onClick={onClose}>×</button>
        </div>

        {!event.updateLogs || event.updateLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            No update history yet
          </div>
        ) : (
          <div className="update-logs">
            {event.updateLogs.map((log, index) => (
              <div key={index} className="update-log-item">
                <div className="update-log-time">
                  {formatTimestamp(log.timestamp, viewTimezone)}
                </div>
                {Object.entries(log.changes).map(([field, change]) => (
                  <div key={field} className="update-log-change">
                    <strong>{field}:</strong>
                    {renderChangeValue(change, viewTimezone)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateLogsModal;
