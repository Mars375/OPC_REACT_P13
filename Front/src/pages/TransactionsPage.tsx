import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../redux/store';
import { useParams } from 'react-router-dom';
import Layout from '../Layouts/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { updateTransactionThunk } from '../redux/accountSlice';
import { AppDispatch } from '../redux/store';

const TransactionsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { accountId } = useParams<{ accountId: string }>();
  const { accounts } = useSelector((state: RootState) => state.account);
  const { profile } = useSelector((state: RootState) => state.profile);

  // Find the account by accountId
  const account = accounts.find((acc) => acc.accountId === accountId);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [category, setCategory] = useState('');
  const [notes, setNotes] = useState('');

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleEdit = (
    index: number,
    currentCategory: string,
    currentNotes: string
  ) => {
    setEditIndex(index);
    setCategory(currentCategory);
    setNotes(currentNotes);
  };

  const handleSave = (index: number) => {
    if (profile && account) {
      dispatch(
        updateTransactionThunk({
          userId: profile.id,
          accountId: account.accountId,
          transactionIndex: index,
          updates: { category, notes },
        })
      );
      setEditIndex(null);
    }
  };

  return (
    <Layout backgroundColor="bg-[#dfe6ed]">
      <>
        {account ? (
          <>
            <header className="border-2 border-gray-200 bg-white p-6 text-center">
              <h1 className="text-xl font-bold">{account.title}</h1>
              <p className="my-2 text-4xl font-bold">{account.amount}</p>
              <p className="text-gray-500">Available Balance</p>
            </header>
            <section className="mt-6 p-12">
              <div className="flex flex-col">
                <header className="flex py-2 font-semibold text-black">
                  <p className="w-1/12"></p>
                  <p className="w-2/12">DATE</p>
                  <p className="w-4/12">DESCRIPTION</p>
                  <p className="w-2/12">AMOUNT</p>
                  <p className="w-2/12">BALANCE</p>
                </header>
                {account.transactions.map((transaction, index) => (
                  <article
                    key={index}
                    className="border border-gray-400 bg-white text-black"
                  >
                    <div
                      onClick={() => toggleExpand(index)}
                      className="flex cursor-pointer items-center py-6"
                    >
                      <div className="w-1/12">
                        <FontAwesomeIcon icon="chevron-down" />
                      </div>
                      <div className="w-2/12">{transaction.date}</div>
                      <div className="w-4/12">{transaction.description}</div>
                      <div className="w-2/12">{transaction.amount}</div>
                      <div className="w-2/12">{transaction.balance}</div>
                    </div>
                    {expandedIndex === index && (
                      <div className="flex flex-col gap-3 px-24 py-4">
                        <div className="flex items-center">
                          <div className="mr-4">Transaction Type:</div>
                          <div className="flex items-center">
                            {transaction.type}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4">Category:</div>
                          <div className="flex items-center">
                            {editIndex === index ? (
                              <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="rounded border p-1"
                              >
                                <option value="Food">Food</option>
                                <option value="Transport">Transport</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Other">Other</option>
                              </select>
                            ) : (
                              <>
                                {transaction.category}
                                <FontAwesomeIcon
                                  icon="pencil-alt"
                                  className="ml-2 cursor-pointer"
                                  onClick={() =>
                                    handleEdit(
                                      index,
                                      transaction.category,
                                      transaction.notes
                                    )
                                  }
                                />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="mr-4">Notes:</div>
                          <div className="flex items-center">
                            {editIndex === index ? (
                              <input
                                type="text"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full rounded border p-1"
                              />
                            ) : (
                              <>
                                {transaction.notes}
                                <FontAwesomeIcon
                                  icon="pencil-alt"
                                  className="ml-2 cursor-pointer"
                                  onClick={() =>
                                    handleEdit(
                                      index,
                                      transaction.category,
                                      transaction.notes
                                    )
                                  }
                                />
                              </>
                            )}
                          </div>
                        </div>
                        {editIndex === index && (
                          <footer className="mt-2 flex justify-end">
                            <button
                              onClick={() => handleSave(index)}
                              className="rounded bg-blue-500 px-4 py-2 text-white"
                            >
                              Save
                            </button>
                          </footer>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <p className="text-red-500">Account not found</p>
        )}
      </>
    </Layout>
  );
};

export default TransactionsPage;
