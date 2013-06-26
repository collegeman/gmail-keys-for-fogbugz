!function($) {
  
  var koi = {
    'j': 74,
    'k': 75,
    'r': 82,
    'e': 69,
    'a': 65,
    'y': 89,
    'f': 70,
    's': 83,
    'i': 73,
    'enter': 13,
    'tab': 9,
    'slash': 191,
    'esc': 27
  };

  var enabled = true,
      indices = {};

  var cancel = function(e) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  };

  var highlight = function(idx) {
    var $row = $('.bug-grid .bug-grid-row:eq(' + idx + ')');
    if (!$row.length) {
      return false;
    }
    $('.bug-grid .bug-grid-row').each(function() {
      var $row = $(this);
      if (!$row.find('input[type="checkbox"]:checked').length) {
        $row.removeClass('selected');
      }
    });
    $row.addClass('selected').find('input[type="checkbox"]:first').focus();
    return true;
  };

  var url = function() {
    return location.toString();
  };

  var isFilterView = function() {
    return url().match("f/(filter|search)");
  };

  var isCaseView = function() {
    return url().match("f/cases");
  };

  var idx = function() {
    var u = url();
    if (indices[u] === undefined) {
      indices[u] = -1;
    }
    return indices[u];
  };

  var inc = function() {
    return indices[url()] = idx() + 1;
  };

  var dec = function() {
    var i = idx();
    if (i < 1) {
      return i;
    }
    return indices[url()] = idx() - 1;
  };

  function openHighlightedCase() {
    if (!isFilterView()) {
      return false;
    }

    var $a = $('.bug-grid .bug-grid-row:eq(' + idx() + ') .case');
    if ($a.length) {
      $a.get(0).click();
      return true;
    } else {
      return false;
    }
  };

  function areCasesSelected() {
    return isFilterView() && $('.bug-grid input[type="checkbox"]:checked').length > 0
  };

  var current = location.toString();
  setInterval(function() {
    if (location.toString() !== current) {
      $(document).trigger('change-page', [ current, location.toString() ]);
      current = location.toString();
    }
  }, 100);

  var $searchField = $('input[name="sSearchFor"]');

  $(document).delegate('input[name="sSearchFor"]', 'focus', function() {
    enabled = false;
  }).delegate('input[name="sSearchFor"]', 'blur', function() {
    enabled = true;
  });

  $(document).delegate('textarea, input[type="text"]', 'focus', function() {
    enabled = false;
  }).delegate('textarea, input[type="text"]', 'blur', function() {
    enabled = true;
  });

  $(document).on('change-page', function(e, from, to) {



  });

  setInterval(function() {
    $('article .body a').each(function() {
      var $this = $(this);
      if ($this.attr('target') !== '_blank') {
        $this.attr('target', '_blank');
      }
    });
  }, 100);

  $(document).on('keydown', function(e) {
    var key = e.keyCode || e.which;
    var modified = e.metaKey || e.ctrlKey || e.altKey || e.shiftKey;
    
    if (!enabled) {
      
      if (key === koi.esc && !modified) {
        $searchField.blur();  
        return cancel(e);
      }

      return true;
    
    }

    if (key === koi.esc && !modified) {
      if ($('#btnCancel:visible').length > 0) {
        $('#btnCancel').get(0).click();
        return cancel(e);
      }

    } else if (key === koi.slash) {
      $searchField.focus();
      return cancel(e);

    } else if (key === koi.j) {

      if (isFilterView() && !modified) {
        if (!highlight(inc())) {
          dec();
        } else {
          return cancel(e);
        }
      } else if (isCaseView() && !modified) {
        var $next = $('.icon-case-next');
        if ($next.length > 0) {
          $next.get(0).click();
          return cancel(e);
        }
      }
    
    } else if (key === koi.k) {
      if (isFilterView() && !modified) {
        if (idx() > 0) {
          if (!highlight(dec())) {
            inc();
          } else {
            return cancel(e);
          }
        }
      } else if (isCaseView() && !modified) {
        var $previous = $('.icon-case-prev');
        if ($previous.length > 0) {
          $previous.get(0).click();
          return cancel(e);
        }
      }

    } else if (key === koi.enter) {

      if (isFilterView() && !modified && idx() > -1) {
        if (openHighlightedCase()) {
          return cancel(e);
        }
      }
      
    } else if (key === koi.r) {

      if (isCaseView() && !modified) {

        var $reply = $('[name="reply"]');
        if ($reply.length) {
          $reply.get(0).click();
          return cancel(e);
        }

        var $reopen = $('[name="reopen"]');
        if ($reopen.length) {
          $reopen.get(0).click();
          return cancel(e);
        }

      } else if (isFilterView() && !modified) {

        if (areCasesSelected()) {
          $('[data-s-action="reply"]').get(0).click();
          return cancel(e);
        } else {
          if (openHighlightedCase()) {
            return cancel(e);
          }
        }

      } 

    } else if (key === koi.e) {

      if (isFilterView() && !modified) {

        if (areCasesSelected()) {
          $('[data-s-action="edit"]').get(0).click();
          return cancel(e);
        } else {
          if (openHighlightedCase()) {
            return cancel(e);
          }
        }

      } else if (isCaseView() && !modified) {

        var $reply = $('[name="reply"]');
        if ($reply.length > 0) {
          $reply.get(0).click();
          return cancel(e);
        }

      }

    } else if (key === koi.a) {

      if (isFilterView() && !modified) {

        if (areCasesSelected()) {
          $('[data-s-action="assign"]').get(0).click();
          return cancel(e);
        } else {
          if (openHighlightedCase()) {
            return cancel(e);
          }
        }

      } else if (isCaseView() && !modified) {

        var $assign = $('[name="assign"]');
        if ($assign.length > 0) {
          $assign.get(0).click();
          return cancel(e);
        }

      }

    } else if (key === koi.y) {

      if (isCaseView() && !modified) {
        var $resolve = $('[name="resolve"]');
        if ($resolve.length > 0) {
          $resolve.get(0).click();
          return cancel(e);
        }
      } else if (isFilterView() && !modified) {
        var $resolve = $('[data-s-action="resolve"]');
        if ($resolve.length > 0) {
          $resolve.get(0).click();
          return cancel(e);
        }
      }

    } else if (key === koi.f) {

      if (isCaseView() && !modified) {
        var $forward = $('[name="forward"]');
        if ($forward.length > 0) {
          $forward.get(0).click();
          return cancel(e);
        }
      }

    } else if (key === koi.s) {

      if (isCaseView() && !modified) {
        var $star = $('.favorite-toggle');
        if ($star.length > 0) {
          $star.get(0).click();
          return cancel(e);
        }
      
      } else if (isFilterView() && !modified) {
        var $spam = $('[data-s-action="spam"]');
        if ($spam.length > 0) {
          $spam.get(0).click();
          return cancel(e);
        }
      }

    } else if (key === koi.i) {

      if (!modified) {
        var $listCases = $('#nav-link-list');
        if ($listCases.length > 0) {
          $listCases.get(0).click();
          return cancel(e);
        }
      }

    }


  });

}(jQuery);