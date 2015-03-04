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
package org.opencastproject.index.service.util;

import static org.junit.Assert.assertTrue;

import org.opencastproject.matterhorn.search.SearchQuery.Order;
import org.opencastproject.matterhorn.search.impl.SortCriterionImpl;

import org.junit.Test;

import java.util.HashSet;
import java.util.Set;

/**
 * Test methods for {@link RestUtils}
 */
public class RestUtilsTest {

  /** Test method for {@link RestUtils#parseSortQueryParameter(String)} */
  @Test
  public void testParseSortQueryParameter() {
    Set<SortCriterionImpl> sortOrders = new HashSet<SortCriterionImpl>();

    sortOrders.add(new SortCriterionImpl("name", Order.Descending));
    assertTrue(RestUtils.parseSortQueryParameter("name:DESC").equals(sortOrders));

    sortOrders.add(new SortCriterionImpl("date", Order.Ascending));
    assertTrue(RestUtils.parseSortQueryParameter("name:DESC,date:ASC").equals(sortOrders));
  }

}
