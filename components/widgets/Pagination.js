/* This file is part of the Twisted Artists Guild project.

 Copyright (C) 2025 Twisted Artists Guild

 Licensed under the GNU General Public License v3.0
 (https://www.gnu.org/licenses/gpl-3.0.en.html).

 This software comes with NO WARRANTY; see the license for details.

 Open source · low-profit · human-first*/
import { useState } from "react";

/**
 * Pagination Component 
 * @param {Object} props - Component props
 * @param {Array} [props.items=[]] - The full list of items to paginate
 * @param {number} [props.itemsPerPage=10] - Number of items to display per page
 * @param {Function} [props.renderPage] - Optional function to render items (if not provided, will render a basic list)
 * @param {number} [props.totalItems] - Alternative to providing items array - just specify the total count
 * @param {number} [props.currentPage=1] - Current page number (1-based)
 * @param {Function} [props.onPageChange] - Callback when page changes
 */
const Pagination = ({ 
    items = [], 
    itemsPerPage = 10, 
    renderPage,
    totalItems: explicitTotalItems,
    currentPage: controlledCurrentPage,
    onPageChange
}) => {
    // Use either controlled or uncontrolled current page
    const [internalCurrentPage, setInternalCurrentPage] = useState(1);
    const currentPage = controlledCurrentPage || internalCurrentPage;

    // Ensure items is an array before accessing length property
    const safeItems = Array.isArray(items) ? items : [];
    
    // Total items can be passed explicitly or derived from items array
    const totalItems = explicitTotalItems !== undefined ? explicitTotalItems : safeItems.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            // If we have an external controller, call the callback
            if (onPageChange && typeof onPageChange === 'function') {
                onPageChange(page);
            } else {
                // Otherwise manage state internally
                setInternalCurrentPage(page);
            }
        }
    };

    // Only slice the array if we have items (for item-based pagination)
    const currentItems = safeItems.length > 0 ? safeItems.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ) : [];

    // Default item renderer if none provided
    const renderItems = (items) => (
        <div className="space-y-2">
            {items.length > 0 ? (
                items.map((item, index) => (
                    <div key={index} className="p-3 bg-base-100 rounded shadow">
                        {JSON.stringify(item)}
                    </div>
                ))
            ) : (
                <div className="p-4 text-center text-base-content/70">No items to display</div>
            )}
        </div>
    );

    return (
        <div className="p-4 bg-base-200 rounded-lg">
            {/* Render current page's items */}
            <div className="mb-4">
                {typeof renderPage === 'function' 
                    ? renderPage(currentItems) 
                    : renderItems(currentItems)}
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn btn-secondary">
                    Previous
                </button>
                <span className="text-lg">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn btn-secondary">
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
