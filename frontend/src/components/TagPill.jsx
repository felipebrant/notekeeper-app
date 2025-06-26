    import React from 'react';

    function TagPill({ tag }) {
      const pillStyle = {
        backgroundColor: tag.color || '#e9ecef',
        color: ['#FFF475', '#CCFF90', '#A7FFEB', '#CBF0F8', '#AECBFA'].includes(tag.color) ? '#343a40' : 'white'
      };

      return (
        <div className="tag-pill" style={pillStyle}>
          {tag.name}
        </div>
      );
    }

    export default TagPill;
    