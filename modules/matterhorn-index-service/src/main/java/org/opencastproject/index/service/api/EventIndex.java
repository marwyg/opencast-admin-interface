/**
 *  Copyright 2009, 2010 The Regents of the University of California
 *  Licensed under the Educational Community License, Version 2.0
 *  (the "License"); you may not use this file except in compliance
 *  with the License. You may obtain a copy of the License at
 *
 *  http://www.osedu.org/licenses/ECL-2.0
 *
 *  Unless required by applicable law or agreed to in writing,
 *  software distributed under the License is distributed on an "AS IS"
 *  BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 *  or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 *
 */
package org.opencastproject.index.service.api;

import java.util.List;

public interface EventIndex {

  /**
   * Returns all the known event locations.
   *
   * @return a list of event locations
   */
  List<String> getEventLocations();

  /**
   * Returns all the known event subjects.
   *
   * @return a list of event subjects
   */
  List<String> getEventSubjects();

  /**
   * Returns all the known event contributors.
   *
   * @return a list of contributors
   */
  List<String> getEventContributors();

  /**
   * Returns all the known event presenters
   *
   * @return a list of presenters
   */
  List<String> getEventPresenters();

  /**
   * Returns all the known theme names
   *
   * @return a list of names
   */
  List<String> getThemeNames();

}
