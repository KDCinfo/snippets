<?php

namespace App\Http\Controllers;

// ... //

class ItemsController extends Controller
{

    protected $ratingFactors = [ '[1-2]', '[1-3]', '[1-4]', '[1-5]', '[1-10]', '[1-20]', '[1-25]', '[1-50]', '[1-100]' ];

    public function index($pathId)
    {
        $curUser = $this->getUserLogged();

        // ... //

        $orderCol = Request::input('order'); // [value] from '?col=value' or 'null'
        $orderDir = Request::input('dir');
        $pageCur = Request::input('page');

        // Check and convert filter querystring
        //
        $attrArray = ['type', 'status', 'medium', 'condition'];
            $orderFilterAttr = Request::input('facet');
            $orderFilterName = Request::input('filter');

        if ( preg_match('/^[1-4]{1}$/', $orderFilterAttr) ) { // If [facet=] querystring is [1-4]

            $filterMap = [1 => 'type', 2 => 'status', 3 => 'medium', 4 => 'condition'];
            $filterSet = '&facet=' . $orderFilterAttr . '&filter=' . $orderFilterName;
            $orderFilterAttr = $filterMap[$orderFilterAttr];

        } elseif ( in_array($orderFilterAttr, $attrArray) ) { // If [facet=] querystring is a given attribute

            // Not using this ... not converting 'type' to 1, etc. ... changed 'ft' to 'faceet' which is more descriptive
            // $filterMap = ['type' => 1, 'status' => 2, 'medium' => 3, 'condition' => 4];
            // $filterSet = '&facet=' . $filterMap[$orderFilterAttr] . '&filter=' . Request::input('filter');
            $filterSet = '&facet=' . $orderFilterAttr . '&filter=' . $orderFilterName;

        } else {

            $orderFilterAttr = '';
            $orderFilterName = '';
            $filterSet = '';
        }

            if (strlen($filterSet) > 0) {
                $filterFacet = ucwords($orderFilterAttr);
                $filterStatus = $orderFilterName;
            } else {
                $filterFacet = '';
                $filterStatus = '';
            }

        // End filter querystring check

        $orderCol = ($orderCol) ? $orderCol : 'title';
        $orderDir = ($orderDir) ? $orderDir : 'asc';
        $pageCur = ($pageCur) ? $pageCur : '1';

        if ($canView) {
            $pageBlock = $findUser->pref_items_per_page;
        } else {
            $pageBlock = 5;
        }

        /* Sorting - Begin */
            $queryMap = [
                'title' => 'item_title',
                'type' => 'type_title',             // 'item_type_id'
                'medium' => 'medium_title',         // 'item_medium_id'
                'status' => 'status_title',         // 'item_status_id'
                'condition' => 'condition_title',   // 'item_condition_id'
                'rating' => 'item_rating',          // 'item_content_id'
                'added' => 'created_at',          // 'created_at'
            ];
            $queryMapModel = [
                'type' => 'itemsType',              // 'item_type_id'
                'medium' => 'itemsMedium',          // 'item_medium_id'
                'status' => 'itemsStatus',          // 'item_status_id'
                'condition' => 'itemsCondition',    // 'item_condition_id'
                'rating' => 'itemsContent',         // 'item_content_id'
            ];
            $queryMapText = $queryMap[$orderCol];

            if ($orderCol == 'title' || $orderCol == 'added') {
                $queryText = $queryMapText;         // Set sort [column title] based on URL (e.g., where URL = 'title' => $queryText = 'item-title')
            } else {
                $queryMapModelText = $queryMapModel[$orderCol];         // This will allow the sorting to be based on a related table's [column title] using dot-notation
                $queryText = $queryMapModelText . "." . $queryMapText;  // (e.g., sortBy(itemsType.type_title) )
            }

        /* WHERE CLAUSES - Init */

            if ($isProperUser) {
                $itemWhere = [
                    'user_id' => $userId    // Owners can view all their items
                ];
            } else {
                $itemWhere = [
                    'user_id' => $userId,
                    'is_viewable' => 1      // Don't show private items for non-owners
                ];
                $whereIsPublic = function ($query) { $query->where('is_public', '=', '1'); };
            }

        /* WHERE CLAUSES - Create Results List */

            // Old: $itemListBase = Item::where($itemWhere)->get()->sortBy($queryText, SORT_STRING | SORT_FLAG_CASE);
            // New: Filting results list using ->whereHas()

            if ($isProperUser) {
                $itemListBase = Item::where($itemWhere);
            } else {

                $whereTypeNotNull = function ($query) use ($whereIsPublic) { $query->whereHas('itemsType', $whereIsPublic)->orWhere('item_type_id', '=', null); };
                $whereMediumNotNull = function ($query) use ($whereIsPublic) { $query->whereHas('itemsMedium', $whereIsPublic)->orWhere('item_medium_id', '=', null); };
                $whereStatusNotNull = function ($query) use ($whereIsPublic) { $query->whereHas('itemsStatus', $whereIsPublic)->orWhere('item_status_id', '=', null); };
                // $whereContentNotNull = function ($query) use ($whereHasRating) { $query->whereHas('itemsContent', $whereHasRating)->orWhere('item_content_id', '=', null); };

                $itemListBase = Item::where($itemWhere)->where($whereTypeNotNull)->where($whereMediumNotNull)->where($whereStatusNotNull);
                // $itemListBase = Item::where($itemWhere)->where($whereTypeNotNull)->where($whereMediumNotNull)->where($whereStatusNotNull)->where($whereContentNotNull);
            }

        // Apply Filters
            if ($orderFilterAttr == 'type') {
                $whereTypeFilter = function ($query) use ($orderFilterName) { $query->where('type_title', '=', $orderFilterName); };
                $itemListBase = $itemListBase->whereHas('itemsType', $whereTypeFilter);
            }
            if ($orderFilterAttr == 'status') {
                $whereStatusFilter = function ($query) use ($orderFilterName) { $query->where('status_title', '=', $orderFilterName); };
                $itemListBase = $itemListBase->whereHas('itemsStatus', $whereStatusFilter);
            }
            if ($orderFilterAttr == 'medium') {
                $whereMediumFilter = function ($query) use ($orderFilterName) { $query->where('medium_title', '=', $orderFilterName); };
                $itemListBase = $itemListBase->whereHas('itemsMedium', $whereMediumFilter);
            }
            if ($orderFilterAttr == 'condition') {
                $whereConditionFilter = function ($query) use ($orderFilterName) { $query->where('condition_title', '=', $orderFilterName); };
                $itemListBase = $itemListBase->whereHas('itemsCondition', $whereConditionFilter);
            }

        // Get list of all attribute types for display in Filter dropdown list
            $itemAttrWhere = [
                'user_id' => $userId,
                'is_public' => 1
            ];
            $itemTypes = ItemsType::where($itemAttrWhere)->get();
            $itemStatuses = ItemsStatus::where($itemAttrWhere)->get();
            $itemMediums = ItemsMedium::where($itemAttrWhere)->get();
            $itemConditions = ItemsCondition::where( [ 'user_id' => $userId ] )->get();

        /* Append sorting to results list (from above) */

            // $queryText = "itemsMedium.medium_title"

            if ($orderCol == 'title') {
                if ($orderDir == 'desc') {
                    $itemListBase = $itemListBase->get()->sortByDesc($queryText, SORT_STRING | SORT_FLAG_CASE);
                } else {
                    $itemListBase = $itemListBase->get()->sortBy($queryText, SORT_STRING | SORT_FLAG_CASE);
                }

            } elseif ($orderCol == 'added') {

                $itemListBase = $itemListBase->get()
                    ->sort(function($a, $b) use ($queryText, $orderDir) {

                        $queryTextTitle = 'item_title';

                        $sortResultVal = strcasecmp($a->$queryText, $b->$queryText);
                        if ($sortResultVal === 0) {
                            $sortResultVal = strtolower($a->$queryTextTitle . "z") > strtolower($b->$queryTextTitle . "z") ? 1 : -1;
                        } else {
                            $sortResultVal = ($orderDir == 'asc') ? $sortResultVal : -1 * $sortResultVal;
                        }
                        return $sortResultVal;
                    });

            } else {

                $itemListBase = $itemListBase->with($queryMapModelText)->get()
                    ->sort(function($a, $b) use ($queryText, $orderDir, $orderCol) {

                        $queryTextTitle = 'item_title';

                        $queryTableName = explode(".", $queryText)[0];
                        $queryFieldName = explode(".", $queryText)[1];

                        if ($orderCol == "rating") { // Ratings are numeric; Don't compare as strings
                            $testCase = -1;
                        } else {
                            $testCase = "";
                        }

                        $queryItem1 = is_null($a->$queryTableName) ? $testCase : (is_null($a->$queryTableName->$queryFieldName) ? $testCase : $a->$queryTableName->$queryFieldName);
                        $queryItem2 = is_null($b->$queryTableName) ? $testCase : (is_null($b->$queryTableName->$queryFieldName) ? $testCase : $b->$queryTableName->$queryFieldName);

                        if ($orderCol == "rating") {
                            $sortResultVal = ($queryItem1 < $queryItem2) ? -1 : (($queryItem1 > $queryItem2) ? 1 : 0);
                        } else {
                            $sortResultVal = strcmp($queryItem1, $queryItem2);
                        }

                        if ($sortResultVal === 0) {
                            $sortResultVal = strtolower($a->$queryTextTitle . "z") > strtolower($b->$queryTextTitle . "z") ? 1 : -1;
                        } else {
                            $sortResultVal = ($orderDir == 'asc') ? $sortResultVal : -1 * $sortResultVal;
                        }
                        return $sortResultVal;
                    });
            }

        $itemList = $itemListBase->forPage($pageCur, $pageBlock);
        $itemListBaseCount = count($itemListBase);
        $pageCount = ceil(($itemListBaseCount / $pageBlock));

        // if ($itemList && count($itemListBase) > 0) {
        // return view('items.showAll')->with(['whichView' => $whichView, 'pageTitle' => $pageTitle, 'pathId' => $pathId, 'items' => $itemList]);

        // RATINGS
        $ratingFactor = $this->ratingFactors[$findUser->rating_factor];
        $ratingFactorNoBrackets = substr($ratingFactor, 1, (strlen($ratingFactor)-2));
        $ratingFactorMax = explode("-", $ratingFactorNoBrackets)[1];

        // VISIBLE COLUMNS
        $availableColumns = [0 => 'Type', 1 => 'Status', 2 => 'Medium', 3 => 'Condition', 4 => 'Rating', 5 => 'Date Added'];
        if (is_null($findUser->show_columns)) {
            $selectedColumns = array('0', '1', '2', '3', '4', '5'); // If null, select all (all columns visible)
        } else {
            $selectedColumns = unserialize($findUser->show_columns); // N; // a:2:{i:0;s:1:"1";i:1;s:1:"4";}
        }
        $selectedColumnsCount = count($selectedColumns);

        return view('items.showAll', [
            'canView' => $canView,
            'whichView' => $whichView,
            'pageTitle' => $pageTitle,
            'pathId' => $pathId,
            'pageCur' => $pageCur,
            'pageCount' => $pageCount,
            'orderCol' => $orderCol,
            'orderDir' => $orderDir,
            'filterSet' => $filterSet,
            'filterFacet' => $filterFacet,
            'filterStatus' => $filterStatus,
            'itemCount' => $itemListBaseCount,
            'items' => $itemList,
            'itemTypes' => $itemTypes,
            'itemStatuses' => $itemStatuses,
            'itemMediums' => $itemMediums,
            'itemConditions' => $itemConditions,
            'ratingFactorMax' => $ratingFactorMax,
            'selectedColumns' => $selectedColumns,
            'selectedColumnsCount' => $selectedColumnsCount,
        ]);
    }
}
